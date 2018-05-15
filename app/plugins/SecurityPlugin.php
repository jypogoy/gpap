<?php

use Phalcon\Acl;
use Phalcon\Acl\Role;
use Phalcon\Acl\Resource;
use Phalcon\Events\Event;
use Phalcon\Mvc\User\Plugin;
use Phalcon\Mvc\Dispatcher;
use Phalcon\Acl\Adapter\Memory as AclList;

/**
 * SecurityPlugin
 *
 * Security plugin which controls user's access to assigned modules.
 */
class SecurityPlugin extends Plugin
{
	/**
	 * Returns an existing or new access control list
	 *
	 * @returns AclList
	 */
	public function getAcl()
	{
		if (!isset($this->persistent->acl)) {

			$acl = new AclList();

			$acl->setDefaultAction(Acl::DENY);

			// Register roles
			$roles = [
				'users'  => new Role(
					'Users',
					'Member privileges, granted after sign in.'
				),
				'guests' => new Role(
					'Guests',
					'Anyone browsing the site who is not signed in is considered to be a "Guest".'
				)
			];

			foreach ($roles as $role) {
				$acl->addRole($role);
			}

			//Private area resources
			$privateResources = [
				'home'      => 	['index'],
				'edits'     => 	['index', 'getjobsbyregion', 'prep'],
				'de'		=>	['index', 'prep', 'start', 'complete', 'redirectnonext', 'redirectsuccess'],
				'batch'		=>	['listavailable', 'get', 'getnextavailable', 'countavailable', 'countwithvariance', 'listwithvariance', 'exception', 'listbyregionjob', 'getprevoperator', 'getkeyer', 'getverifier', 'getbalancer', 'isavailable'],
				'currency'	=>	['getbyregion'],
				'image'		=>	['list', 'get'],
				'installment_months'	=>	['list'],
				'merchant'	=>	['get'],
				'merchant_header'	=>	['get', 'save', 'getsame', 'getsameregionday'],
				'other_exception'	=>	['list'],
				'pull_reason'	=>	['getbylevel'],
				'transaction'	=>	['getbyheader', 'deleteprevious', 'save', 'transdateelevenmonthsolder', 'transdatefuture'],
				'transaction_type'	=>	['list'],
				'user_task'		=>	['getbyuser'],
				'data_entry'	=>	['getbyusertask', 'getbycountertask', 'getbylastcompleted'],
				'dcn'			=>	['record', 'getsamemidamountregion', 'getsameregionday'],
				'session'    	=> 	['changepassword'],
				'security'		=>	['checkbylastsixpasswords', 'passwordchangedsameday', 'passworddictionarycheck', 'passwordtrivialcheck', 'passwordpersonalinfocheck', 'updatepassword']
			];

			foreach ($privateResources as $resource => $actions) {
				$acl->addResource(new Resource($resource), $actions);
			}

			//Public area resources
			$publicResources = [
				'index'      =>	['index'],
				'about'      => ['index'],
				'errors'     => ['show401', 'show404', 'show500'],
				'session'    => ['index', 'register', 'start', 'end'],
				'contact'    => ['index']
			];

			foreach ($publicResources as $resource => $actions) {
				$acl->addResource(new Resource($resource), $actions);
			}

			//Grant access to public areas to both users and guests
			foreach ($roles as $role) {
				foreach ($publicResources as $resource => $actions) {
					foreach ($actions as $action){
						$acl->allow($role->getName(), $resource, $action);
					}
				}
			}			
			
			//Grant access to private area to role Users
			foreach ($privateResources as $resource => $actions) {
				foreach ($actions as $action){
					$acl->allow('Users', $resource, $action);
				}
			}

			//The acl is stored in session, APC would be useful here too
			$this->persistent->acl = $acl;
		}

		return $this->persistent->acl;
	}

	/**
	 * This action is executed before execute any action in the application
	 *
	 * @param Event $event
	 * @param Dispatcher $dispatcher
	 * @return bool
	 */
	public function beforeExecuteRoute(Event $event, Dispatcher $dispatcher)
	{
		$auth = $this->session->get('auth');
		if (!$auth){
			$role = 'Guests';
		} else {
			$role = 'Users';
		}

		$controller = $dispatcher->getControllerName();
		$action = $dispatcher->getActionName();

		$acl = $this->getAcl();

		if (!$acl->isResource($controller)) {
			$dispatcher->forward([
				'controller' => 'errors',
				'action'     => 'show404'
			]);

			return false;
		}

		$allowed = $acl->isAllowed($role, $controller, $action);
		if (!$allowed) {
			$dispatcher->forward([
				'controller' => 'errors',
				'action'     => 'show401'
			]);
            //$this->session->destroy();
			return false;
		}
	}
}

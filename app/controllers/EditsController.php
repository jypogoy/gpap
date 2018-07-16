<?php

class EditsController extends ControllerBase
{
    
    public function initialize()
    {
        $this->tag->setTitle('Edits');
        parent::initialize();
        //parent::checkSession();

        if ($this->session->get('initLogin')) {
            return $this->response->redirect('session/changepassword');            
        } 
    }

    public function indexAction()
    {
        try {
            $regions = Region::find();
            $this->view->regions = $regions;
            
        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }

        $this->sessionLogger->info($this->session->get('auth')['name'] . ' @ Edits page.'); 
    }

    public function getJobsByRegionAction()
    {
        $this->view->disable();

        $regionCode = $this->request->getPost('regionCode');
        $recDate = $this->request->getPost('recDate');
        
        // Keep reference of the selected region.        
        $this->session->set('regionCode', $regionCode); 
        $this->session->set('recDate', $recDate);

        try {
            // $zips = Zip::findByRegionCode($regionCode);            
            $phql = "SELECT DISTINCT * 
                    FROM Zip 
                    INNER JOIN Batch ON Batch.zip_id = Zip.id
                    WHERE region_code = '" . $regionCode . "'" . (strpos($recDate, 'aN') === false ? " AND DATE(Batch.create_date) = '" . $recDate . "'" : "") . "
                    GROUP BY Zip.id";

            $zips = $this->modelsManager->executeQuery($phql);        

            echo $this->view->partial('edits/partial_job_selection', [ 'zips' => $zips ]);  

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }       
    }

    public function prepAction()
    {
        $this->view->disable();

        $batchId = $this->request->getPost('batch_id');
        $taskId = $this->request->getPost('task_id');
        $taskName = $this->request->getPost('task_name');

        $this->session->set('fromEdits', true);
        $this->session->set('taskId', $taskId);
        $this->session->set('taskName', $taskName);  
    }

    public function recordEditorAction()
    {
        $userId = $this->session->get('auth')['id'];
        $batchId = $this->request->getPost('batch_id');
        $taskId = $this->request->getPost('task_id');
        
        try {
            $batchEdit = new BatchEdit();
            $batchEdit->task_id = $taskId;
            $batchEdit->batch_id = $batchId;
            $batchEdit->user_id = $userId;

            if (!$batchEdit->save()) {
                foreach ($entry->getMessages() as $message) {
                    $this->flash->error($message);
                }

                $this->dispatcher->forward([
                    'controller' => "home",
                    'action' => 'index'
                ]);

                return;
            }

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }  
    }

    public function getRecentEditorAction()
    {        
        $this->view->disable();

        $taskId = $this->request->getPost('task_id');
        $batchId = $this->request->getPost('batch_id');
        
        try {
            $phql = 'SELECT * 
                    FROM BatchEdit 
                    INNER JOIN User ON User.userID = BatchEdit.user_id
                    WHERE BatchEdit.task_id = :taskId: AND BatchEdit.batch_id = :batchId: 
                    ORDER BY create_date DESC LIMIT 1';

            $editor = $this->modelsManager->executeQuery(
                $phql, 
                [
                    'taskId' => $taskId,
                    'batchId' => $batchId
                ]
            );    

            $this->response->setJsonContent($editor[0]);
            $this->response->send();     

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }  
    }

    public function resetFiltersAction()
    {
        $this->session->remove('regionCode');
        $this->session->remove('recDate'); 
        $this->session->remove('zipId'); 
    }

    // public function beforeExecuteRoute()
	// {
    //     parent::checkSession();
    // }
}
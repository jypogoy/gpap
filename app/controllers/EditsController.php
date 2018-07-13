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
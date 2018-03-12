<?php

use Phalcon\Mvc\User\Component;

/**
 * Elements
 *
 * Helper class to build listing components.
 */
class Listing extends Component
{

    public function getTable()
    {

    }

    public function getPagination($page, $start, $end, $totalItems, $currentPage, $itemsPerPage)
    {
        
        $controllerName = $this->view->getControllerName();

        $content = '<div class="ui equal width stackable grid">
                <div class="column">
                    <div class="common-text">' .
                        ((count($page->items) > 0) ?  "Page " . $page->current . " of " . $page->total_pages . ". Showing Records " . $start . " - " . $end . " of " . $totalItems . "." : 'No projects to show...') .
                    '</div>
                </div>
                <div class="column">
                    <div style="display: ' . (count($page->items) > 0 ? '' : 'none') . '">
                        Display
                        <select class="ui dropdown" id="displaySelect">
                            <option value="10"' . ($itemsPerPage == 10 ? 'selected' : '') . '>10</option>
                            <option value="25"' . ($itemsPerPage == 25 ? 'selected' : '') . '>25</option>
                            <option value="50"' . ($itemsPerPage == 50 ? 'selected' : '') . '>50</option>
                            <option value="100"' . ($itemsPerPage == 100 ? 'selected' : '') . '>100</option>
                            <option value="-1"' . ($itemsPerPage == $totalItems ? 'selected' : '') . '>All</option>
                        </select>
                    </div>    
                </div>
                <div class="column">
                    <div class="ui right floated pagination menu" style="display: ' . (count($page->items) > 0 ? '' : 'none') . '">
                        <a href onclick="paginate(' . $page->first . '); return false;" class="icon item ' . ($page->current == 1 ? 'disabled':'') . '">
                            <i class="angle double left icon"></i>
                        </a>
                        <a href onclick="paginate(' . $page->before . '); return false;" class="icon item ' . ($page->current == 1 ? 'disabled':'') . '">
                            <i class="angle left icon"></i>
                        </a> ';    
                        
                        $pages = self::pagination($currentPage, $page->total_pages);                        
                        
                        for ($p = 0; $p <= count($pages); $p++) {   
                            if (isset($pages[$p]) && strlen($pages[$p]) > 0) {
                                if ($pages[$p] != '...') {
                                    $content = $content . '<a href onclick="paginate(' . $pages[$p] . '); return false;" class="item ' . ($page->current == $pages[$p] ? 'active paging':'') . '">' . $pages[$p] . '</a>';
                                } else {   
                                    $content = $content . '<div class="item">' . $pages[$p] . '</div>';
                                }
                            }   
                        };
                                                        
            $content = $content . '<a href onclick="paginate(' . $page->next . '); return false;" class="icon item ' . ($page->current == $page->last ? 'disabled':'') . '")">
                            <i class="angle right icon"></i>
                        </a>
                        <a href onclick="paginate(' . $page->last . '); return false;" class="icon item ' . ($page->current == $page->last ? 'disabled':'') . '">
                            <i class="angle double right icon"></i>
                        </a>
                    </div>                                    
                </div>
            </div>';      

            $content = $content . '<script>
                                    $(function() {
                                        $("#displaySelect").on("change", function () {
                                            $("#currentPage").val(1);
                                            $("#itemsPerPage").val(this.value);
                                            $("#listForm").submit(); 
                                        });
                                    });

                                    function paginate(page) {
                                        $("#currentPage").val(page);
                                        $("#listForm").submit();
                                    }
                                </script>';    

            echo $content;
    }

    function pagination($c, $m) 
    {
        $current = $c;
        $last = $m;
        $delta = 1;
        $left = $current - $delta;
        $right = $current + $delta + 1;
        $range = array();
        $rangeWithDots = array();
        $l = -1;

        for ($i = 1; $i <= $last; $i++) 
        {
            if ($i == 1 || $i == $last || $i >= $left && $i < $right) 
            {
                array_push($range, $i);
            }
        }

        for($i = 0; $i<count($range); $i++) 
        {
            if ($l != -1) 
            {
                if ($range[$i] - $l === 2) 
                {
                    array_push($rangeWithDots, $l + 1);
                } 
                else if ($range[$i] - $l !== 1) 
                {
                    array_push($rangeWithDots, '...');
                }
            }
            
            array_push($rangeWithDots, $range[$i]);
            $l = $range[$i];
        }

        return $rangeWithDots;
    }

}
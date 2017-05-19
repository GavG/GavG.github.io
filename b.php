<html>
	<head>
        <style type="text/css">
            body, html
            {
                margin: 0; padding: 0; height: 100%; overflow: hidden; background: red;
            }

            #content
            {
                position:absolute; left: 0; right: 0; bottom: 0; top: 0px; 
            }
        </style>

<?php
$ref = $_SERVER['HTTP_REFERER'];
$html = file_get_contents($ref);
preg_match_all('/<title>(.*?)<\/title>/s', $html, $matches);
$ref_title = $matches[1][0];

echo "<title>$ref_title</title>";
echo "</head>";
echo "<body>";
echo "<script> alert('This page is not supported by your browser.\\nReturning to $ref'); history.pushState(null, '$ref_title', '$ref');</script>";
echo "<div id='c'>";
echo "<iframe width='100%' height='100%' frameborder='0' src='$ref'></iframe>";
echo "</div>";
?>

</body>
</html>
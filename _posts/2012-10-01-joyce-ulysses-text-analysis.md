<?php
$pageTitle = "Visualizing Joyce's <i>Ulysses</i>:&nbsp;Sensory Deprivation";
include("proj-header.php");
?>

<script type="text/javascript">
        var _w = window.devicePixelRatio > 1 ? 750 : 900,
            project_data = {
                nav:false,
                image_list: [
                    { clss:"proj-img", src:"proj-05-img.png", alt:"ulysses text analysis", w:_w }],
                descrip:["A visual depiction of all the points in <i>Ulysses</i> at which Joyce mentions sensory deprivation. Each row of rectangles represents one of the eighteen chapters in the book, and the height of each row is set proportionally to the length of each chapter. I represented the whole book as positive sensory data, dark rectangles, in order to show the sensory 'gaps' in it, the lighter rectangles. The lighter the rectangle, the higher the density of 'negative' sense words (like 'silence' or 'blind')."]
            };

        require(["text!../templates/project_template.html"],function(project_template){
            _.templateSettings.variable = "zx";
            var t = _.template(project_template,project_data);
            d3.select("#proj-wrapper").html(t);
            d3.select("div.descrip p").html(project_data.descrip);
        });
</script>

</body>
</html>
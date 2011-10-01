$(function () {
    // Settings
    var viewportTop = 80,
        scrollTime = 600,
        openTime = 600,
        completeTime = 1200,
        siteName = "Kisko Labs",
        scrollElement = "html,body";

    // Initialize waypoints
    $("#wrapper > section").waypoint({
        offset: viewportTop
    });

    // Detect iOS and Android
    if ((!navigator.userAgent.match(/iPhone/i)) && (!navigator.userAgent.match(/iPod/i)) && (!navigator.userAgent.match(/iPad/i)) && (!navigator.userAgent.match(/Android/i))) {
        // Sticky nav for desktop
        $("#nav").stickyPanel();
        // Do stuff when waypoints are reached
        $("body").delegate("#wrapper > section", "waypoint.reached", function (event, direction) {
            var $active = $(this);
            if (direction === 'up') {
                $active = $active.prev();
            }
            if (!$active.length) {
                $active.end();
            }
            $(".section-active").removeClass("section-active");
            $active.addClass("section-active");
            $(".selected").removeClass("selected");
            $("a[href=#" + $active.attr("id") + "]").addClass("selected");
        });
    }

    // Smooth scrolling for internal links
    $("a[href^='#']").click(function (event) {
        event.preventDefault();
        var $this = $(this),
            target = this.hash,
            $target = $(target);
        $(scrollElement).stop().animate({
            "scrollTop": $target.offset().top
        }, scrollTime, "swing", function () {
            window.location.hash = target;
        });
    });

    $.history.init(function (hash) {
        if (hash == "") {
            $(scrollElement).stop().animate({
                "scrollTop": 0
            }, scrollTime, "swing", function () {
                window.location.hash = "home";
            });
        } else {
            var hashTarget = $("#" + hash),
                $target = $(hashTarget);
            $(scrollElement).stop().animate({
                "scrollTop": hashTarget.offset().top
            }, scrollTime, "swing", function () {
                window.location.hash = hash;
            });
        }
    }, {
        unescape: ",/"
    });

    // Hover class
    $("#services .col4").mouseover(function () {
        $(this).addClass("over");
    });
    $("#services .col4").mouseout(function () {
        $(this).removeClass("over");
    });
    $("#blog").delegate("article", "mouseover", function () {
        $(this).addClass("over");
    });
    $("#blog").delegate("article", "mouseout", function () {
        $(this).removeClass("over");
    });

    // Fit Text
    $("#home h1").fitText(0.9);

    // Load images
    function loadImages() {
        if ($(this).parent("#project_sb")) {
            if ($(".project_sb .slides img").length === 0) {
                $(".project_sb .slides").append("<img src='/images/work/splendidbacon1.jpg' /><img src='/images/work/splendidbacon2.jpg' /><img src='/images/work/splendidbacon3.jpg' /><img src='/images/work/splendidbacon4.jpg' />");
            }
        }
        if ($(this).parent("#project_bs")) {
            if ($(".project_bs .slides img").length === 0) {
                $(".project_bs .slides").append("<img src='/images/work/bookspottings1.jpg' />");
            }
        }
        if ($(this).parent("#project_vb")) {
            if ($(".project_vb .slides img").length === 0) {
                $(".project_vb .slides").append("<img src='/images/work/venturebonsai1.jpg' /><img src='/images/work/venturebonsai2.jpg' /><img src='/images/work/venturebonsai3.jpg' /><img src='/images/work/venturebonsai4.jpg' />");
            }
        }
        if ($(this).parent("#project_mt")) {
            if ($(".project_mt .slides img").length === 0) {
                $(".project_mt .slides").append("<img src='/images/work/mealtracker1.jpg' /><img src='/images/work/mealtracker2.jpg' /><img src='/images/work/mealtracker3.jpg' /><img src='/images/work/mealtracker4.jpg' />");
            }
        }
    }

    // Open a project
    $("#work .block").click(function (event) {
        event.preventDefault();
        var getProject = $(this).parent().attr("id");
        $(".openproject." + getProject + " .slides").cycle("destroy");
        // If there isn't a open project, open one
        if (!($(".openproject").hasClass("active"))) {
            $(".openproject." + getProject).fadeIn(openTime).animate({
                height: "800px"
            }, openTime).addClass("active");
            loadImages();
            // Slideshow
            $(".openproject." + getProject + " .slides").cycle({
                fx: "fade",
                timeout: 0,
                pager: ".openproject." + getProject + " .pagination",
                slideExpr: "img"
            });
            // Refresh waypoints after animate completes
            setTimeout(function () {
                $("#wrapper > section").waypoint({
                    offset: viewportTop
                });
            }, completeTime);
            document.title = siteName + " - " + $(".openproject." + getProject + " h3").text();
            // Else close the open one first and then open another
        } else {
            $(".openproject.active").fadeOut(openTime).removeClass("active").animate({
                height: "0"
            }, openTime);
            $(".openproject." + getProject).fadeIn(openTime).addClass("active").animate({
                height: "800px"
            }, openTime);
            loadImages();
            // Slideshow
            $(".openproject." + getProject + " .slides").cycle({
                fx: "fade",
                timeout: 0,
                pager: ".openproject." + getProject + " .pagination",
                slideExpr: "img"
            });
            document.title = siteName + " - " + $(".openproject." + getProject + " h3").text();
        }
    });

    // Close project
    $("#work .close").click(function (event) {
        event.preventDefault();
        $(".openproject.active").fadeOut(openTime).removeClass("active").animate({
            height: "0"
        }, openTime);
        // Refresh waypoints after document height change
        setTimeout(function () {
            $("#wrapper > section").waypoint({
                offset: viewportTop
            });
        }, completeTime);
        document.title = siteName;
    });
});
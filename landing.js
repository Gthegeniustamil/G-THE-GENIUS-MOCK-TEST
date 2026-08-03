/* ==========================================
   G THE GENIUS
   Landing JavaScript
   Part 1

   Features:
   - User Status Check
   - Dynamic Navigation
   - CTA Control
========================================== */



/* ==========================================
   Check User Login
========================================== */


function checkUserStatus(){


    const userName =

    localStorage.getItem(
        "studentName"
    );



    const joinBtn =

    document.querySelector(
        ".primary-btn"
    );



    const loginBtn =

    document.querySelector(
        ".secondary-btn"
    );






    if(userName){


        if(joinBtn){

            joinBtn.textContent =
            "🚀 Go Dashboard";


            joinBtn.onclick = ()=>{


                location.href =
                "dashboard.html";


            };

        }





        if(loginBtn){

            loginBtn.textContent =
            "👤 Profile";


            loginBtn.onclick = ()=>{


                location.href =
                "profile.html";


            };


        }



    }



}







/* ==========================================
   Smooth Scroll
========================================== */


function smoothScroll(){


    document
    .querySelectorAll(
        "a[href^='#']"
    )
    .forEach(

        link=>{


        link.onclick = (e)=>{


            e.preventDefault();


            const target =

            document.querySelector(
                link.getAttribute(
                    "href"
                )
            );



            if(target){

                target.scrollIntoView({

                    behavior:"smooth"

                });

            }


        };


    });


}







/* ==========================================
   Page Load
========================================== */


window.addEventListener(

"DOMContentLoaded",

()=>{


    checkUserStatus();


    smoothScroll();


});

/* ==========================================
   G THE GENIUS
   Landing JavaScript
   Part 2 Final

   Features:
   - Social Links
   - Visitor Tracking Ready
   - Final Connection
========================================== */



/* ==========================================
   Social Links Setup
========================================== */


function setupSocialLinks(){


    const youtubeBtn =

    document.querySelector(
        ".youtube-btn"
    );



    const telegramBtn =

    document.querySelector(
        ".telegram-btn"
    );





    if(youtubeBtn){


        youtubeBtn.href =

        "https://youtube.com/@GTheGeniusTamil";


        youtubeBtn.target =
        "_blank";


    }






    if(telegramBtn){


        telegramBtn.href =

        "#";


        telegramBtn.target =
        "_blank";


    }



}







/* ==========================================
   Visitor Counter Ready
========================================== */


function trackVisitor(){


    let visits =

    Number(

        localStorage.getItem(
            "landingVisits"
        )
        ||
        0

    );



    visits++;




    localStorage.setItem(

        "landingVisits",

        visits

    );



}







/* ==========================================
   Initialize Landing Page
========================================== */


window.addEventListener(

"DOMContentLoaded",

()=>{


    setupSocialLinks();


    trackVisitor();


});

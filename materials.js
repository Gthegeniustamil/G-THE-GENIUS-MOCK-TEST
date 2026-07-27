*{
    box-sizing:border-box;
    font-family:Arial, sans-serif;
}


body{

    margin:0;
    background:#071426;
    color:white;

}



.materials-container{

    width:92%;
    max-width:700px;
    margin:auto;
    padding:20px;

}



/* HEADER */

.materials-header{

    text-align:center;
    background:linear-gradient(135deg,#0d47a1,#1565c0);
    padding:25px;
    border-radius:20px;
    margin-bottom:20px;

}


.materials-header h1{

    margin:0;
    font-size:28px;

}


.materials-header p{

    font-size:18px;

}




/* SEARCH */

.search-box{

    width:92%;
    max-width:700px;
    margin:20px auto 10px;

}


.search-box input{

    width:100%;
    padding:14px;

    border:none;
    outline:none;

    border-radius:25px;

    font-size:16px;

}



/* CATEGORY BUTTON */

.category-box{

    width:92%;
    max-width:700px;

    margin:auto;

    display:flex;
    flex-wrap:wrap;
    gap:10px;

}


.category-box button{

    padding:10px 16px;

    border:none;

    border-radius:20px;

    background:#1565c0;

    color:white;

    font-weight:bold;

    cursor:pointer;

}




.category-box button:hover{

    background:#00c853;

}





/* MATERIAL CARD */


.material-card{

    background:#11243d;

    padding:20px;

    margin-bottom:15px;

    border-radius:18px;

    box-shadow:0 5px 15px rgba(0,0,0,0.3);

}



.material-card h3{

    color:#ffd700;

    margin-top:0;

}



.material-card p{

    color:#ddd;

}



/* READ BUTTON */


.material-card button{

    padding:12px 22px;

    border:none;

    border-radius:25px;

    background:#00c853;

    color:white;

    font-weight:bold;

    cursor:pointer;

}





/* PDF VIEWER */


#pdfViewerBox{

    background:#11243d;

    padding:15px;

    border-radius:15px;

    margin-bottom:20px;

}


#pdfViewer{

    border:none;

    border-radius:10px;

}




/* BACK BUTTON */


.back-btn{

    width:100%;

    padding:15px;

    margin-top:20px;

    border:none;

    border-radius:15px;

    background:#ff9800;

    color:white;

    font-size:16px;

    font-weight:bold;

}




@media(max-width:600px){


.materials-header h1{

    font-size:22px;

}


.category-box button{

    font-size:13px;

    padding:8px 12px;

}


        }

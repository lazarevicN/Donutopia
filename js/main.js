window.onload = function(){
    var strana = window.location.pathname;
    if(strana == "/index.html" || strana == "/products.html" || strana == "/order.html" || strana =="/author.html" || strana == "/cart.html" || strana == "/Donutopia/" ||strana == "/Donutopia/index.html" || strana == "/Donutopia/products.html" || strana == "/Donutopia/order.html" || strana =="/Donutopia/author.html" || strana == "/Donutopia/cart.html"){
        napraviZaglavlje();
        urediPTagoveLokacije();
        zatvoriLokaciju();
        sakrijElemente();
        animacije();
        ispisSocijalnihMreza();
        ispisDokumentacije();
        $("#hamburger").click(responsiveZaglavlje)
    }
    if(strana =="/index.html" || strana == "/Donutopia/index.html"){
        animacijaBlokovaKojiVodeNaDrugeStraneSajta();
    }
    if(strana =="/products.html" || strana == "/Donutopia/products.html"){
        napraviChbxFiltriranja();
        napraviProizvode();
        ispisDropdownListeZaSortiranje();
        $("#ddlSortiranje").change(sortiraj);
        $("#search").keyup(filtrirajPoSearchu);
        $("#tasterZaPrelazNaProizvode").hide();
        $("#tasterZaPrelazNaProizvode").fadeIn(6000);
    }
    if(strana == "/order.html" || strana == "/Donutopia/order.html"){
        ispisiKorakePorudzbine();
        $("#dostava").click(prikaziFormuDostave);
        $("#kontaktiraj").click(prikaziFormuKontaktiranja);
        $("#tasterSubmit").click(proveriFormuDostave);
        $("#tasterSubmitKontakt").click(proveriFormuKontaktiranja);
    }
    if(strana == "/cart.html" || strana == "/Donutopia/cart.html"){
        let krofneIzLocalStoragea = krofneULocalStorageu()
        if(!krofneIzLocalStoragea){
            console.log(krofneIzLocalStoragea)
            $("#praznaKorpaDefault").show();
            $("#vratiNaProizvode").show();
            $("#headerKorpe").hide();
        }else{
            prikaziKupljeneKrofne();
            $("#vratiNaProizvode").show();
            $("#prebaciNaPorudzbinu").show();
            $("#headerKorpe").show();
            if(krofneIzLocalStoragea.length == 0){
                $("#praznaKorpaDefault").show();
                $("#vratiNaProizvode").show();
                $("#prebaciNaPorudzbinu").hide();
                $("#headerKorpe").hide();
            }
        }
    }
}

function obrisiSveIzLsa(){
    console.log("leroy obrisan ls")
    localStorage.removeItem("krofne")
}

function prikaziKupljeneKrofne(){
    let krofneIzLocalStoragea = krofneULocalStorageu();
    console.log(krofneIzLocalStoragea);
    ajaxZahtev("data/products.json", function(krofne){
        let nizFiltriranihKrofni = krofne.filter(k =>{
            for(let kls of krofneIzLocalStoragea){
                if(k.id == kls.id){
                    k.kolicina = kls.kolicina;
                    return k;
                }
            }
            return false;
        })
        ispisiKrofneUKorpu(nizFiltriranihKrofni)
        $(".ukloniProizvod").click(obrisiIzKorpe);
    })
}

function ispisiKrofneUKorpu(krofne){
    let ispis = ""
    krofne.forEach(k=>{
        ispis += ` <ul  class="rasporediHorizontalno sirina100 urediListe borderRadius">
            <li><img src="${k.slikaKorpe.src}" alt="${k.slikaKorpe.alt}" /></li>
            <li class="obojiUBelo fontSize20">${k.naziv}</li>
            <li class="obojiUBelo fontSize20">${k.vrstaKrofne.vrsta}</li>
            <li class="obojiUBelo fontSize20">`+zaokruziUkupnuCenuKrofni(k.cena, k.kolicina)
        ispis += `&euro;</li>
            <li class="obojiUBelo fontSize20">${k.kolicina}<span><a class="ukloniProizvod" data-idkrofneizlsa="${k.id}" href="#"><i class="fas fa-trash-alt"></i></a></span></li>
            </ul>`
    })
    $("#korpaKrofni").html(ispis);
}

function obrisiIzKorpe(e){
    e.preventDefault();
    let krofneIzLocalStoragea = krofneULocalStorageu();
    let idKrofneZaBrisanje = $(this).data("idkrofneizlsa");
    let nizKrofniKojeOstavljamo = krofneIzLocalStoragea.filter(k => k.id != idKrofneZaBrisanje)
    promeniLocalStorageKrofni(nizKrofniKojeOstavljamo)
    prikaziKupljeneKrofne(nizKrofniKojeOstavljamo)
    if(!nizKrofniKojeOstavljamo.length){
        $("#ispraznjenaKorpa").fadeIn(1000);
        $("#headerKorpe").hide();
        $("#prebaciNaPorudzbinu").hide();
    }
}

function zaokruziUkupnuCenuKrofni(cena, kolicina){
    return Math.round((cena*kolicina)*100) / 100;
}

function responsiveZaglavlje(){
    let nizLiTagovaNavigacije = document.getElementsByClassName("liTagovi");
        console.log(nizLiTagovaNavigacije)
    $("#zaglavlje ul").toggleClass("otvoriNavigaciju");
    for(let i = 0 ; i<nizLiTagovaNavigacije.length; i++){
        $(nizLiTagovaNavigacije[i]).toggleClass("fade");
    }
}
//funckije za sve stranice
function ajaxZahtev(jsonPodatak, rezultat){
    $.ajax({
        url: jsonPodatak,
        method:"GET",
        dataType:"json",
        success: rezultat,
        error:function(xhr, error, status){
            alert("Neuspesno");
        }
    })
}
function napraviZaglavlje(){

    ajaxZahtev("data/menu.json", function(navigacija){
        ispisZaglavlja(navigacija);
    })
}

function ispisZaglavlja(navigacija){

    document.getElementById("zaglavlje").innerHTML += ispisiLiTagove();

    aktivanLink();

    hoverLinkova();

    prikaziLokaciju();

    function ispisiLiTagove(){

        let ispisLiTagova = `<ul class="rasporediHorizontalno" id="navigacija">`;
        navigacija.forEach(n =>{

            ispisLiTagova += `<li class="liTagovi"><a href="${n.putanja}" class="obojiUBelo">${n.opis}</a></li>`;
        });

        ispisLiTagova += `</ul>`

        return ispisLiTagova;
    }
}

function prikaziLokaciju(){
    $("#lokacija").click(function(){
        $("#prikaziLokaciju").fadeIn("slow");
    })
} 

function zatvoriLokaciju(){
    $("#zatvoriIkonica").click(function(){
        $("#prikaziLokaciju").fadeOut("slow");
    })
}

function animacijaBlokovaKojiVodeNaDrugeStraneSajta(){
    $(".blokSaLinkomKaProizvodima h2 a").hover(
        function(){
            $(this).css("margin-left","200px")
            $(this).css("color","black")
            $(this).css("border-bottom","5px solid black")
            $(this).css("padding-bottom","15px")
        },
        function(){
            $(this).css("margin-left","0px")
            $(this).css("color","white")
            $(this).css("border-bottom","0px")
            $(this).css("padding-bottom","0px")
        }
    )
}

function hoverLinkova(){
    $("#zaglavlje ul li a").hover(
        function(){
            $(this).css("color", "#8acbe6");
        },
        function(){
            $(this).css("color", "white");
        }
    )
    $("#harmonijaUkusa p a i").hover(
        function(){
        $("#harmonijaUkusa p a i").css("color", "#8acbe6");
    },
    function(){
        $("#harmonijaUkusa p a i").css("color", "white");
    }
    )
   $(".fontSizeH3 a i").hover(
       function(){
           $(this).css("color", "#8acbe6");
       },
       function(){
        $(this).css("color", "white");
    }
   )
   $("#socijalneMreze a i").hover(
    function(){
        $(this).css("color", "#8acbe6");
    },
    function(){
     $(this).css("color", "white");
    }
    )
    $("#kontakt p a").hover(
    function(){
        $(this).css("color", "#8acbe6");
    },
    function(){
        $(this).css("color", "white");
    }
    )
    $("#dokumentacija a").hover(
        function(){
            $(this).css("color", "#8acbe6");
        },
        function(){
            $(this).css("color", "white");
        }
        )
}
function animacije(){
    $("#zaglavlje").animate({top:'60px'}, 400);
    $("#zaglavlje").animate({top:'-80px'}, 500);
    $("#zaglavlje").animate({top:'30px'}, 600);
    $("#zaglavlje").animate({top:'-40px'},700);
    $("#zaglavlje").animate({top:'15px'}, 800);
    $("#zaglavlje").animate({top:'-20px'}, 900);
    $("#zaglavlje").animate({top:'0px'}, 1000);
    $("#hamburger").fadeIn(6000);
    $("#harmonijaUkusa h1").fadeIn(6000);
    $("#harmonijaUkusa h2").fadeIn(7000);
    $("#harmonijaUkusa p a i").fadeIn(6000);
}

function aktivanLink(){
    $("#zaglavlje ul li a[href]").each(function(){
        if(this.href == window.location.href){
            $(this).addClass("aktivan")
        }
    })
}

function urediPTagoveLokacije(){
   $("#prikaziLokaciju p").addClass("levaMarginaLokacije");
   $("#prikaziLokaciju p").css('font-size','20px');
   $("#prikaziLokaciju p a").css({'color':'white'},{'border-bottom':'2px solid #8acbe6'});
}

function sakrijElemente(){
    $("#harmonijaUkusa h1").hide();
    $("#harmonijaUkusa h2").hide();
    $("#harmonijaUkusa p a i").hide();
    $("#hamburger").hide();
    $("#praznaKorpaDefault").hide();
    $("#vratiNaProizvode").hide();
    $("#prebaciNaPorudzbinu").hide();
    $("#headerKorpe").hide();
}

function ispisSocijalnihMreza(){
    let nizLinkova = ["https://twitter.com", "https://www.instagram.com"];
    let nizOpisa = ["<i class='fab fa-twitter obojiUBelo fontSizeH2'></i>", "<i class='fab fa-instagram obojiUBelo fontSizeH2'></i>"];
    let ispisListe = `<ul class="rasporediHorizontalno">`;
    for(let i=0; i<nizLinkova.length;i++){
        ispisListe += `<li><a href="${nizLinkova[i]}">${nizOpisa[i]}</a></li>`
    }
    ispisListe += `</ul>`;
    document.getElementById("socijalneMreze").innerHTML += ispisListe;
}
function ispisDokumentacije(){
    let nizOpisa = ["CSS", "Responsive", "Sitemap", "JS", "About site"];
    let nizLinkova = ["css/style.css", "css/queris.css", "sitemap.xml", "js/main.js", "dokumentacija.docx"];
    let ispisListe = `<ul class="rasporediHorizontalno">`;
    for(let i=0; i<nizOpisa.length;i++){
        ispisListe += `<li><a href="${nizLinkova[i]}" class="obojiUBelo">${nizOpisa[i]}</a></li>`
    }
    ispisListe += `</ul>`;
    document.getElementById("dokumentacija").innerHTML += ispisListe;
}

//funkcije za products.html
function sortiraj(){
    let ddlVal = $("#ddlSortiranje").val();
    ajaxZahtev("data/products.json", function(proizvodi){
        if(ddlVal == "a-z"){
            proizvodi.sort(function(a, b){
                if(a.naziv < b.naziv)
                    return -1;
            })
            ispisProizvoda(proizvodi)
        }
        else if(ddlVal == "z-a"){
            proizvodi.sort(function(a, b){
                if(a.naziv > b.naziv)
                    return -1;
            })
            ispisProizvoda(proizvodi)
        }
        else if(ddlVal == "highest-lowest"){
            proizvodi.sort(function(a, b){
                if(a.cena > b.cena)
                    return -1;
            })
            ispisProizvoda(proizvodi)
        }
        else if(ddlVal == "lowest-highest"){
            proizvodi.sort(function(a, b){
                if(a.cena < b.cena)
                    return -1
            })
            ispisProizvoda(proizvodi)
        }
        else{
            ispisProizvoda(proizvodi)
        }
    })
}
function filtrirajPoSearchu(){
    let searchVal = this.value;
    console.log(searchVal)
    ajaxZahtev("data/products.json", function(proizvodi){

        let filtriraniPoSearchu = proizvodi.filter(p => {
            if(p.naziv.toLowerCase().indexOf(searchVal.trim().toLowerCase()) != -1 ){
                return true;
            }else{
                return false;
            }
        }) 
        if(filtriraniPoSearchu.length > 0){
            ispisProizvoda(filtriraniPoSearchu)
        }else{
            document.getElementById("proizvodi").innerHTML = `<div id="porukaZaNepostojaceProizvode">
                                                                <h1 class="obojiUBelo">We are sorry, there arent any products with that name...</h1>
                                                            </div>`;
        }
    })
} 
function napraviProizvode(){

    ajaxZahtev("data/products.json", function(proizvodi){
        ispisProizvoda(proizvodi);
    })
}

function ispisProizvoda(proizvodi){

    document.getElementById("proizvodi").innerHTML = ispisiArtikle();

    function ispisiArtikle(){

        let ispisArtikala = "";
        proizvodi.forEach(p =>{

            ispisArtikala += `<div class="urediProizvode rasporediVertikalno borderRadius">
                                <img src="${p.slika.src}" alt="${p.slika.alt}" />
                                <h5 class="obojiUBelo fontSizeH5 ">${p.naziv}</h5>
                                <p class="obojiUBelo margineOpisa tekstOpisaCentriraj visinaOpisa">${p.opis}</p>
                                <p class="obojiUBelo margineOpisa ">Price: ${p.cena} &euro;</p>
                                <input type="button" value="Buy now" class="urediDugme borderRadius dodajUKorpu" data-idproizvoda="${p.id}" />
                                <p class="oznaciTekstNaslova margineOpisa ubacenUKorpu fontSize18" data-idkliknutogptaga="${p.id}">Added to cart...</p>    
                            </div>`;
        });
        return ispisArtikala;
    }

    $(".ubacenUKorpu").hide();
    $(".dodajUKorpu").click(prikaziPorukuKupljeneKrofne)
    $(".dodajUKorpu").click(dodajUKorpu)
}

function dodajUKorpu(){
    let idKrofne = $(this).data("idproizvoda");
    var krofne = krofneULocalStorageu()

    function kupljeneKrofne(){
        return krofne.filter(p => p.id == idKrofne).length
    }

    if(krofne){
        if(kupljeneKrofne()){
            let dohvatiKrofneIzLocalStoragea = krofneULocalStorageu()
            for(let k in dohvatiKrofneIzLocalStoragea){
                if(dohvatiKrofneIzLocalStoragea[k].id == idKrofne){
                    dohvatiKrofneIzLocalStoragea[k].kolicina++;
                    break;
                }
            }
            promeniLocalStorageKrofni(dohvatiKrofneIzLocalStoragea)
        }
        else{
            let krofneLocalStorage = krofneULocalStorageu()
            krofneLocalStorage.push({
                id: idKrofne,
                kolicina: 1
            })
            promeniLocalStorageKrofni(krofneLocalStorage)
        }
    }
    else{
        let noveKrofne = [];
        noveKrofne[0] = {
            id: idKrofne,
            kolicina: 1
        }
        promeniLocalStorageKrofni(noveKrofne)
    }


}

function krofneULocalStorageu(){
    return JSON.parse(localStorage.getItem("krofne"))
}

function promeniLocalStorageKrofni(krofne){
    localStorage.setItem("krofne", JSON.stringify(krofne))
}

function prikaziPorukuKupljeneKrofne(){
    let idTastera = $(this).data("idproizvoda")
    let pTogProizvoda = $(this).parent().children(".ubacenUKorpu")
    let pIdKliknutog = $(this).parent().children(".ubacenUKorpu").data("idkliknutogptaga")
    if(idTastera == pIdKliknutog){
        animacijaPorukeDodavanjaUKorpu(pTogProizvoda)
    }
}
function animacijaPorukeDodavanjaUKorpu(ptag){
    ptag.fadeIn(1000)
    ptag.fadeOut(2500)
}
function napraviChbxFiltriranja(){

    ajaxZahtev("data/vrsteKrofni.json", function(vrste){
        ispisChbxFiltriranja(vrste)
    })
}

function ispisChbxFiltriranja(vrste){
    
    function ispisCheckboxova(){
        let ispisChbx = "<ul class='gornjaMarginaChbx'>";
        vrste.forEach(v =>{
            ispisChbx += `<li><input type="checkbox" name="vrstaKrofne" value="${v.idVrste}" class="chbxFilter levaMarginaFilteraISorta gornjaMarginaChbx"/><span class="obojiUBelo urediVrsteKrofni fontSize20">${v.vrsta}</span></li>`;
        });
        ispisChbx += "</ul>";
        return ispisChbx;
    }
    document.getElementById("blokZaFiltriranje").innerHTML += ispisCheckboxova();
    $(".chbxFilter").click(filtrirajPoChbx)
}

var nizCekiranih = [];

function filtrirajPoChbx(){
    let cekirani = this.value;
    if(!nizCekiranih.includes(cekirani)){
            nizCekiranih.push(cekirani)
    }else{
            const nizNeki = nizCekiranih.filter(odcekirani =>{
                if(cekirani != odcekirani)
                    return true;
            })
            nizCekiranih = nizNeki
    }
    if(nizCekiranih.length != 0){
        ajaxZahtev("data/products.json", function(krofne){
            ispisProizvoda(filtrirajKrofnePoVrsti(krofne))
        })
    }else{
        ajaxZahtev("data/products.json", function(krofne){
            ispisProizvoda(krofne)
        })
    }

}

function filtrirajKrofnePoVrsti(krofne){
    const filtriraneKrofne = krofne.filter(k=>{
        for(let id of nizCekiranih){
            if(k.vrstaKrofne.id == id){
                return true;
            }
        }
    })
    return filtriraneKrofne;
}

function ispisDropdownListeZaSortiranje(){
    let nizOpisa = ["Name A-Z", "Name Z-A", "Price Highest to Lowest", "Price Lowest to Highest"];
    let nizValuea = ["a-z", "z-a", "highest-lowest", "lowest-highest"];
    let ispisListe = `<select name="sortiranje" id="ddlSortiranje" class="borderRadius fontSize20"><option value="default">Default</option>`;
    for(let i=0; i<nizOpisa.length;i++){
        ispisListe += `<option value="${nizValuea[i]}">${nizOpisa[i]}</option>`
    }
    ispisListe += `</select>`;
    document.getElementById("blokZaFilterSearchISort").innerHTML += ispisListe;
}

//funkcije za dostavu i kontakt
function prikaziFormuDostave(){
    $(this).addClass("aktivan");
    $("#formaKontakta").css("display","none");
    $("#kontaktiraj").removeClass("aktivan");
    $("#formaDostave").css("display", "block");
}
function prikaziFormuKontaktiranja(){
    $(this).addClass("aktivan");
    $("#formaDostave").css("display","none");
    $("#formaKontakta").css("display", "block");
    $("#dostava").removeClass("aktivan");
}
function ispisiKorakePorudzbine(){

    let ispisKorakaPorudzbine = "";
    ajaxZahtev("data/orderInfo.json", function(koraci){
        koraci.forEach(k=>{
            ispisKorakaPorudzbine += `<div class="rasporediVertikalno urediKorakePorudzbine">
                                        <img src="${k.slika.src}" alt="${k.slika.alt}" />
                                        <h3 class="obojiUBelo tekstOpisaCentriraj gornjaMarginaFiltriranja">${k.naslov}</h3>
                                        <p class="obojiUBelo tekstOpisaCentriraj margineOpisa fontSize18">${k.opis}</p>
                                    </div>`
        })
        document.getElementById("koraciPorucivanja").innerHTML = ispisKorakaPorudzbine
    })
}

function proveriFormuDostave(){
    //dohvati sve Value koje korisnik unese u input polja
    let imeVal = $("#ime").val();
    let prezimeVal = $("#prezime").val();
    let emailVal = $("#email").val();
    let gradVal = $("#grad").val();
    let ulicaVal = $("#ulica").val();
    let postanskiBrVal = $("#postanskiBr").val();
    let telefonVal = $("#telefon").val();

    //pravljenje Regexa za proveru unetih vrednosti
    let regexIme = /^[A-Z][a-z]{2,15}(\s[A-Z][a-z]{2,15})*$/;
    let regexPrezime = /^[A-Z][a-z]{2,17}(\s[A-Z][a-z]{2,17})*$/;
    let regexEmail = /^\w+([\.-]\w+)*@(gmail||hotmail||yahoo)\.com$/;
    let regexGrad = /^[A-Z][a-z]{2,12}(\s[A-Z][a-z]{2,12})*$/;
    let regexUlica = /^[A-Z][a-z]{3,20}(\s[A-Z][a-z]{3,20})*\s[0-9]+([a-z])?$/;
    let regexPostanskiBr = /^[1-3][0-9]{4}$/;
    let regexTelefon = /^06[0-9][0-9]{7}$/;

    //provera Regexa

    let validno = false;


    function proveriRegexe(regex, inputVal, input, greska){
        if(inputVal == ""){
            if(inputVal == emailVal){
                $("#greskaEmaila").html("You must enter your email adress.");
                validno = false;
            }
            if(inputVal == gradVal){
                $("#greskaGrada").html("You must enter city you live in.");
                validno = false;
            }
            if(inputVal == telefonVal){
                $("#greskaTelefona").html("You must enter your phone number.");
                validno = false;
            }
            $(input).removeClass("obojiZelenomPolje");
            $(input).addClass("obojiCrvenomPolje");
            validno = false;
        }
        else{
            if(regex.test(inputVal)){
                $(input).removeClass("obojiCrvenomPolje");
                $(input).addClass("obojiZelenomPolje");
                $(greska).html("");
                validno = true;
            }
            else{
                $(input).removeClass("obojiZelenomPolje");
                $(input).addClass("obojiCrvenomPolje");
                if(inputVal == emailVal){
                    $("#greskaEmaila").html("Your email is invalid. Please, enter again. Example: mika(0-9)(.-_)mikic(0-9)@gmail/hotmail/yahoo.com");            }else if(inputVal == gradVal){
                }
                if(inputVal == gradVal){
                    $("#greskaGrada").html("The name of city you entered is invalid. Please, enter again. Example: Kraljevo, Novi Sad,...");
                }
                if(inputVal == telefonVal){
                    $("#greskaTelefona").html("Your phone number is not in good format. Please, enter again. Example: 06(0-9)(0-9)x7");
                }
                validno = false;
            }
        }
    }

    function proveriRegexeDuplihInputa(prviRegex, drugiRegex, prviInputVal, drugiInputVal, prviInput, drugiInput, greska){
        if(prviInputVal == "" && drugiInputVal == ""){
            if(prviInputVal == imeVal && drugiInputVal == prezimeVal){
                $("#greskaImenaIPrezimena").html("You must enter your first and last name.");
                validno = false;
            }
            if(prviInputVal == ulicaVal && drugiInputVal == postanskiBrVal){
                $("#greskaUliceIPostanskogBr").html("You must enter your street name and postal code of city.");
                validno = false;
            }
            $(prviInput).addClass("obojiCrvenomPolje");
            $(drugiInput).addClass("obojiCrvenomPolje");
            $(prviInput).removeClass("obojiZelenomPolje");
            $(drugiInput).removeClass("obojiZelenomPolje");
            validno = false;
        }
        else if(prviInputVal == ""){
            $(prviInput).addClass("obojiCrvenomPolje");
            $(prviInput).removeClass("obojiZelenomPolje");
            validno = false;
            if(drugiRegex.test(drugiInputVal)){
                $(drugiInput).addClass("obojiZelenomPolje");
                $(drugiInput).removeClass("obojiCrvenomPolje");
                validno = false;
                if(prviInputVal == imeVal){
                    $("#greskaImenaIPrezimena").html("You must enter your first name.");
                    validno = false;
                }
                if(prviInputVal == ulicaVal){
                    $("#greskaUliceIPostanskogBr").html("You must enter your street name and number.");
                    validno = false;
                }
            }else{
                $(drugiInput).addClass("obojiCrvenomPolje");
                $(drugiInput).removeClass("obojiZelenomPolje");
                validno = false;
                if(drugiInputVal == prezimeVal){
                    $("#greskaImenaIPrezimena").html("You must enter your first name and your last name is invalid. Please, enter again. Example: Peric( Mikic)");
                    validno = false;
                }
                if(drugiInputVal == postanskiBrVal){
                    $("#greskaUliceIPostanskogBr").html("You must enter your street name and number your postal code of city is invalid. Please, enter again. Example: 1-3[0-9]x4");
                    validno = false;
                }
            }
        }
        else if(drugiInputVal == ""){
            validno = false;
            $(drugiInput).addClass("obojiCrvenomPolje");
            $(drugiInput).removeClass("obojiZelenomPolje");
            if(prviRegex.test(prviInputVal)){
                validno = false;
                $(prviInput).addClass("obojiZelenomPolje");
                $(prviInput).removeClass("obojiCrvenomPolje");
                if(drugiInputVal == prezimeVal){
                    $("#greskaImenaIPrezimena").html("You must enter your last name.");
                    validno = false;
                }
                if(drugiInputVal == postanskiBrVal){
                    $("#greskaUliceIPostanskogBr").html("You must enter the postal code of your city.");
                    validno = false;
                }
            }else{
                $(prviInput).addClass("obojiCrvenomPolje");
                $(prviInput).removeClass("obojiZelenomPolje");
                validno = false;
                if(prviInputVal == imeVal){
                    validno = false;
                    $("#greskaImenaIPrezimena").html("You must enter your last name and your frist name is invalid. Please, enter again. Example: Pera( Mika)");
                }
                if(prviInputVal == ulicaVal){
                    validno = false;
                    $("#greskaUliceIPostanskogBr").html("You must enter the postal code of your city and your street and number is invalid. Please, enter again. Example: Cvijiceva( Maksima Gorkog) (0-9)+(a-z)");
                }
            }
        }
        else{
            if(prviRegex.test(prviInputVal) && drugiRegex.test(drugiInputVal)){
                //Ako je uspesno prosao regex, inpute bojimo u zeleno(tacno), brisemo im klasu crvenom(ukoliko je korisnik pre toga uneo los format za proveru) i tekst warning
                $(prviInput).addClass("obojiZelenomPolje");
                $(prviInput).removeClass("obojiCrvenomPolje");
                $(drugiInput).addClass("obojiZelenomPolje");
                $(drugiInput).removeClass("obojiCrvenomPolje");
                validno = true;
                if(prviInputVal == imeVal){
                    $("#greskaImenaIPrezimena").html("");
                    validno = true;
                }
                if(prviInputVal == ulicaVal){
                    $("#greskaUliceIPostanskogBr").html("");
                    validno = true;
                }
                if(drugiInputVal == prezimeVal){
                    $("#greskaImenaIPrezimena").html("");
                    validno = true;
                }
                if(drugiInputVal == postanskiBrVal){
                    $("#greskaUliceIPostanskogBr").html("");
                    validno = true;
                }
            }
            else if(!prviRegex.test(prviInputVal) && !drugiRegex.test(drugiInputVal)){
                //Ako je neuspesan regex, inpute bojimo u crveno(netacno), brisemo im klasu zeleno(ukoliko je korisnik pre toga uneo los format za proveru) i tekst warning
                $(prviInput).removeClass("obojiZelenomPolje");
                $(prviInput).addClass("obojiCrvenomPolje");
                $(drugiInput).removeClass("obojiZelenomPolje");
                $(drugiInput).addClass("obojiCrvenomPolje");
                validno = false;
                if(prviInputVal == imeVal){
                    validno = false;
                    $("#greskaImenaIPrezimena").html("Your first and last name are invalid. Please, enter again.");
                }
                if(prviInputVal == ulicaVal){
                    validno = false;
                    $("#greskaUliceIPostanskogBr").html("The street, number and postal code are invalid. Please, enter again.");
                }
                if(drugiInputVal == prezimeVal){
                    validno = false;
                    $("#greskaImenaIPrezimena").html("Your first and last name are invalid. Please, enter again.");
                }
                if(drugiInputVal == postanskiBrVal){
                    validno = false;
                    $("#greskaUliceIPostanskogBr").html("The street, number and postal code are invalid. Please, enter again.");
                }
            }
            else if(!prviRegex.test(prviInputVal) && drugiRegex.test(drugiInputVal)){
                //Ako je nije uspesno prosao prvi regex, prvi input bojimo u crveno(netacno) i ispisujemo tekst warning
                $(prviInput).removeClass("obojiZelenomPolje");
                $(prviInput).addClass("obojiCrvenomPolje");
                $(drugiInput).addClass("obojiZelenomPolje");
                $(drugiInput).removeClass("obojiCrvenomPolje");
                validno = false;
                if(prviInputVal == imeVal){
                    validno = false;
                    $("#greskaImenaIPrezimena").html("Your first name is invalid. Please, enter again. Example: Pera( Peric)");
                }
                if(prviInputVal == ulicaVal){
                    validno = false;
                    $("#greskaUliceIPostanskogBr").html("Your street name and number is invalid. Please, enter again. Example: Cvijiceva(Knez Mihailova)(0-9)+(a-z)");
                }
            }
            else if(prviRegex.test(prviInputVal) && !drugiRegex.test(drugiInputVal)){
                //Ako je nije uspesno prosao drugi regex, drugi input bojimo u crveno(netacno) i ispisujemo tekst warning
                $(prviInput).addClass("obojiZelenomPolje");
                $(prviInput).removeClass("obojiCrvenomPolje");
                $(drugiInput).removeClass("obojiZelenomPolje");
                $(drugiInput).addClass("obojiCrvenomPolje");
                validno = false;
                if(drugiInputVal == prezimeVal){
                    validno = false;
                    $("#greskaImenaIPrezimena").html("Your last name is invalid. Please, enter again. Example: Peric( Mikic)");
                }
                if(drugiInputVal == postanskiBrVal){
                    validno = false;
                    $("#greskaUliceIPostanskogBr").html("Your postal code of the city is invalid. Please, enter again. Example: (1-3)(0-9)x4");
                }
            }
        }
        

    }
    proveriRegexeDuplihInputa(regexIme, regexPrezime, imeVal, prezimeVal, "#ime", "#prezime")
    proveriRegexeDuplihInputa(regexUlica, regexPostanskiBr, ulicaVal, postanskiBrVal, "#ulica", "#postanskiBr")
    proveriRegexe(regexEmail, emailVal, "#email", "#greskaEmaila");
    proveriRegexe(regexGrad, gradVal, "#grad", "#greskaGrada");
    proveriRegexe(regexTelefon, telefonVal, "#telefon", "#greskaTelefona");

    if(validno){
        $("#porukaFormeDostava").css("display", "block")
    }else{
        $("#porukaFormeDostava").css("display", "none")
    }

}

function proveriFormuKontaktiranja(){
    //dohvatanje vrednosti podataka koje klijent unese za kontakt
    let imeVal = $("#imeKontakt").val();
    let prezimeVal = $("#prezimeKontakt").val();
    let emailVal = $("#emailKontakt").val();
    let txtAreaVal = $("#porukaZaKontakt").val();
    //regexi za proveru vrednosti podataka koje kijent unese za kontakt
    let regexIme = /^[A-Z][a-z]{2,15}(\s[A-Z][a-z]{2,15})*$/;
    let regexPrezime = /^[A-Z][a-z]{2,17}(\s[A-Z][a-z]{2,17})*$/;
    let regexEmail = /^\w+([\.-]\w+)*@(gmail||hotmail||yahoo)\.com$/;
    let regexTxtArea = /^[A-Za-z0-9]{1,1000}(\s[A-Za-z0-9]{1,1000})*(\.)*(\s[A-Za-z0-9]{1,1000})*$/
    //provera podataka
    function proveriRegexeKontakta(regexKontakta, valKontakta, inputKontakta){
        if(valKontakta == ""){
            if(valKontakta == emailVal){
                $("#greskaEmailaKontakt").html("You must enter your email adress.");
            }
            if(valKontakta == txtAreaVal){
                $("#greskaPorukeKontakt").html("You must write down your question.");
            }
            $(inputKontakta).removeClass("obojiZelenomPolje");
            $(inputKontakta).addClass("obojiCrvenomPolje");
            validno = false;
        }
        else{
            if(regexKontakta.test(valKontakta)){
                $(inputKontakta).removeClass("obojiCrvenomPolje");
                $(inputKontakta).addClass("obojiZelenomPolje");
                if(valKontakta == emailVal){
                    /* console.log("usao u if regexa") */
                    $("#greskaEmailaKontakt").html("");
                }
                if(valKontakta == txtAreaVal){
                    $("#greskaPorukeKontakt").html("");

                }
                validno = true;
            }
            else{
                $(inputKontakta).removeClass("obojiZelenomPolje");
                $(inputKontakta).addClass("obojiCrvenomPolje");
                if(valKontakta == emailVal){
                    $("#greskaEmailaKontakt").html("Your email is invalid. Please, enter again. Example: mika(0-9)(.-_)mikic(0-9)@gmail/hotmail/yahoo.com");
                }
                if(valKontakta == txtAreaVal){
                    $("#greskaPorukeKontakt").html("You must have at least 1 word with min 1 char.");
                }
                validno = false;
            }
        }
    }
    proveriRegexeKontakta(regexEmail, emailVal, "#emailKontakt")
    proveriRegexeKontakta(regexTxtArea, txtAreaVal, "#porukaZaKontakt")

    if(imeVal == "" && prezimeVal == ""){
        $("#greskaImenaIPrezimenaKontakt").html("You must enter your first and last name.");
        validno = false;
        $("#imeKontakt").addClass("obojiCrvenomPolje");
        $("#prezimeKontakt").addClass("obojiCrvenomPolje");
        $("#imeKontakt").removeClass("obojiZelenomPolje");
        $("#prezimeKontakt").removeClass("obojiZelenomPolje");
    }
    else if(imeVal == ""){
        $("#imeKontakt").addClass("obojiCrvenomPolje");
        $("#imeKontakt").removeClass("obojiZelenomPolje");
        validno = false;
        if(regexPrezime.test(prezimeVal)){
            $("#prezimeKontakt").addClass("obojiZelenomPolje");
            $("#prezimeKontakt").removeClass("obojiCrvenomPolje");
            validno = false;
            $("#greskaImenaIPrezimenaKontakt").html("You must enter your first name.");
        }
        else{
            $("#prezimeKontakt").addClass("obojiCrvenomPolje");
            $("#prezimeKontakt").removeClass("obojiZelenomPolje");
            validno = false;
            $("#greskaImenaIPrezimenaKontakt").html("You must enter your first name and your last name is invalid. Please, enter again. Example: Peric( Mikic)");
        }
    }
    else if(prezimeVal == ""){
        $("#prezimeKontakt").addClass("obojiCrvenomPolje");
        $("#prezimeKontakt").removeClass("obojiZelenomPolje");
        validno = false;
        if(regexIme.test(imeVal)){
            $("#imeKontakt").addClass("obojiZelenomPolje");
            $("#imeKontakt").removeClass("obojiCrvenomPolje");
            $("#greskaImenaIPrezimenaKontakt").html("You must enter your last name.");
            validno = false;
        }
        else{
            $("#imeKontakt").addClass("obojiCrvenomPolje");
            $("#imeKontakt").removeClass("obojiZelenomPolje");
            $("#greskaImenaIPrezimenaKontakt").html("You must enter your last name and your first name is invalid. Please, enter again. Example: Pera( Mika)");
            validno = false;
        }
    }
    else{
        if(regexIme.test(imeVal) && regexPrezime.test(prezimeVal)){
            //Ako je uspesno prosao regex, inpute bojimo u zeleno(tacno), brisemo im klasu crvenom(ukoliko je korisnik pre toga uneo los format za proveru) i tekst warning
            $("#imeKontakt").addClass("obojiZelenomPolje");
            $("#imeKontakt").removeClass("obojiCrvenomPolje");
            $("#prezimeKontakt").addClass("obojiZelenomPolje");
            $("#prezimeKontakt").removeClass("obojiCrvenomPolje");
            validno = true;
            $("#greskaImenaIPrezimenaKontakt").html("");
        }
        else if(!regexIme.test(imeVal) && !regexPrezime.test(prezimeVal)){
            //Ako je neuspesan regex, inpute bojimo u crveno(netacno), brisemo im klasu zeleno(ukoliko je korisnik pre toga uneo los format za proveru) i tekst warning
            $("#imeKontakt").removeClass("obojiZelenomPolje");
            $("#imeKontakt").addClass("obojiCrvenomPolje");
            $("#prezimeKontakt").removeClass("obojiZelenomPolje");
            $("#prezimeKontakt").addClass("obojiCrvenomPolje");
            validno = false;
            $("#greskaImenaIPrezimenaKontakt").html("Your first and last name are invalid. Please, enter again.");
        }
        else if(!regexIme.test(imeVal) && regexPrezime.test(prezimeVal)){
            //Ako je nije uspesno prosao prvi regex, prvi input bojimo u crveno(netacno) i ispisujemo tekst warning
            $("#imeKontakt").removeClass("obojiZelenomPolje");
            $("#imeKontakt").addClass("obojiCrvenomPolje");
            $("#prezimeKontakt").addClass("obojiZelenomPolje");
            $("#prezimeKontakt").removeClass("obojiCrvenomPolje");
            validno = false;
            $("#greskaImenaIPrezimenaKontakt").html("Your first name is invalid. Please, enter again. Example: Pera( Peric)");
        }
        else if(regexIme.test(imeVal) && !regexPrezime.test(prezimeVal)){
            //Ako je nije uspesno prosao drugi regex, drugi input bojimo u crveno(netacno) i ispisujemo tekst warning
            $("#imeKontakt").addClass("obojiZelenomPolje");
            $("#imeKontakt").removeClass("obojiCrvenomPolje");
            $("#prezimeKontakt").removeClass("obojiZelenomPolje");
            $("#prezimeKontakt").addClass("obojiCrvenomPolje");
            validno = false;
                $("#greskaImenaIPrezimenaKontakt").html("Your last name is invalid. Please, enter again. Example: Peric( Mikic)");
        }
    } 

    if(validno){
        $("#porukaFormeKontakt").css("display", "block")
    }else{
        $("#porukaFormeKontakt").css("display", "none")
    }

}

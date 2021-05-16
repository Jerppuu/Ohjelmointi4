import Popup from "./Popup";
import GitHubLogo from "./other/GitHub_Logo.png"

function NavBarContent(props) {
    return (
        <div>
            {props.mode === 1 && <Popup
                content={<>
                    <b>Tietoa meistä</b>
                    <p>Tämä sivusto on harjoitustyö osana ohjelmointi 4 kurssia.</p>
                    <p>Sivuston säätiedot tarjoaa Foreca.</p>
                    <p>Tekijät:</p>
                    <p>Jere Pesälä</p>
                    <p>Akke Törmänen</p>
                    <a href="https://github.com/Jerppuu/Ohjelmointi4">
                        <img src={GitHubLogo} alt="GitHubLogo" style={{maxHeight: "50px"}}/>
                    </a>
                </>}
                handleClose={() => props.togglePopup(0)}
            />}


            {props.mode === 2 && <Popup
                content={<>
                    <b>Ohjeet</b>
                    <p>
                        Hakeminen: Kirjoita hakupalkkiin haluamasi kunnan nimi. Huomaa, että kunta pitää olla täysin
                        oikein kirjoitettu, jotta se löytyy tietokannasta. Voit halutessasi hakea tarkemmin esimerkiksi
                        kansainvälisiä kohteita kirjoittamalla paikkakunnan ja maan. Esimerkiksi: Tukholma,Ruotsi.
                    </p>
                    <p>
                        Viikkonäkymä: Viikkonäkymässä voit kulkea nykyisen ja seuraavan viikon väliä
                        painamalla edellinen tai seuraava painikkeita viikkonäkymässä.
                    </p>
                    <p>
                        Päivänäkymä: Päivänäkymä avautuu valitsemasi päivän kohdalta, kun klikkaat viikkonäkymässä
                        haluamaasi päivää.
                        Päivänäkymässä voit liikkua päivien välillä painamalla edellinen ja seuraava painikkeita.
                        Takaisin viikkonäkymään pääset painamalla takaisin painiketta.
                    </p>
                </>}
                handleClose={() => props.togglePopup(0)}
            />}

        </div>
    );
}

export default NavBarContent;
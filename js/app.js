const pagebtn = document.getElementById('btn');

function RedirectToAPI() {
    return {
      redirect: () => {
        pagebtn.addEventListener('click', () => {
           window.location = 'https://rapidapi.com/emma0martins/api/climate-change-live-and-history'
        });
    }
 }
}
const isLocated = RedirectToAPI();
isLocated.redirect();


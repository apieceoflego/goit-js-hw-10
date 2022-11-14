import { fetchCountries } from './fetchCountries';
import lodashDebounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  lodashDebounce(textInInput, DEBOUNCE_DELAY)
);

function textInInput(event) {
  const nameOfCountry = event.target.value.trim();
  if (!nameOfCountry) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(nameOfCountry)
    .then(checkQuantityOfCountry)
    .catch(() =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function checkQuantityOfCountry(name) {
  const quantityOfCountry = name.length;
  if (quantityOfCountry > 10) {
    Notiflix.Notify.warning(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  if (quantityOfCountry >= 2 && quantityOfCountry < 10) {
    addCountriesMarkUp(name);
    return;
  }
  if (quantityOfCountry === 1) {
    addOneCountryMarkUp(name);
    return;
  }
}

function addCountriesMarkUp(name) {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = name
    .map(({ name, flags }) => {
      return `<li><img src=${flags.svg} width = 45px, height = 25px></img><span>${name.official}</span></li>`;
    })
    .join('');
  return;
}

function addOneCountryMarkUp(name) {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = name
    .map(({ name, flags, capital, population, languages }) => {
      return `<li>
      <h2><img width="35" height="25" src="${flags.svg}"</img>
      ${name.official}</h2>
      <p>Capital: ${capital[0]}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p></li>`;
    })
    .join('');
}

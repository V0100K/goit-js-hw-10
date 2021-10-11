import '/css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from '/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};
const clearData = () => {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
};
const input = () => {
    const name = refs.input.value.trim();
    if (name.length === 0) {
        clearData();
        return;
    } else {
        fetchCountries(name)
            .then(data => {
                if (data.length > 1 && data.length <= 10) {
                    if (refs.countryInfo.textContent.length > 1) {
                        refs.countryInfo.textContent = '';
                    }
                    return makeCountryList(data);
                }

                if (data.length === 1) {
                    const country = data[0];
                    if (refs.countryList.textContent.length > 1) {
                        refs.countryList.textContent = '';
                    }
                    return makeCountryInfo(country);
                }

                if (data.length > 10) {
                    clearData();
                    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                    return;
                }

                if (data.status === 404) {
                    clearData();
                    Notiflix.Notify.failure('Oops, there is no country with that name.');
                    return;
                }
            })
            .catch(err => console.log(error));
    }
};

const makeCountryList = data => {
    const markup = data
        .map(
            item => `<li class="country-item">
            <img src="${item.flags.svg}" alt="${item.name.common}" width="70" height="50">
            <span class="country-name">${item.name.common}</span></li>`,
        )
        .join('');
    refs.countryList.innerHTML = markup;
};

const makeCountryInfo = item => {
    const markup = `<p class="country-title"><img src="${item.flags.svg}" alt="${
        item.name.common
    }" width="100" height="70">
  <span class="country-name">${item.name.common}</span></p>
              <p class="info-iteam"><span class="title">Capital:</span> ${item.capital}</p>
              <p class="info-iteam"><span class="title">Population:</span> ${item.population}</p>
              <p class="info-iteam"><span class="title">Languages:</span> ${[...Object.values(item.languages)].join(
                  ', ',
              )}</p>`;

    refs.countryInfo.innerHTML = markup;
};
refs.input.addEventListener('input', debounce(input, DEBOUNCE_DELAY));

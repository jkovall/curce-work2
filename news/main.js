var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (xhr.readyState == XMLHttpRequest.DONE) {
    //alert(xhr.responseText);
    document.write(xhr.responseText);
  }
}
xhr.open('GET', 'index.html', false);
xhr.send(null);
let region_name = 'Рівне'

url = `https://api.openweathermap.org/data/2.5/weather?q=${region_name}&lang=ua&appid=47065cb9ab1a711c668427875a0d6e0e`

url_1 = `https://api.openweathermap.org/data/2.5/weather?q=${region_name}&cnt=7&lang=ua&appid=47065cb9ab1a711c668427875a0d6e0e`

fetch(url)
	.then(response => response.json())
	.then(response => {
        console.log(response)
        // region
        document.getElementById('region').textContent = region_name
        // temp
        document.getElementById('temp').textContent = (response.main.temp-273.15).toFixed(2)+'°C'
        // feel
        document.getElementById('feel').textContent = (response.main.feels_like-273.15).toFixed(2)+'°C'
        // weather_description
        let description =  response.weather[0].description
        document.getElementById('weather_description').textContent = description[0].toUpperCase()+description.slice(1)

    })
	.catch(err => console.error(err));  
    
let category_list = {
    'general':'Всі',
    'business':'Бізнес',
    'health':'Здоров’я',
    'science':'Наука',
    'sports':'Спорт',
    'technology':'Технології',
    'entertainment':'Шоу-бізнес',

}

function checkImg(url, imgStatus){
    if(url){
        // fetch(url)
        // .then(response=>{
        //     if(response.status!=200){
        //         return false
        //     }
        //     else {
        //         return true
        //     }
        // })
        // .then(status=>{
        //     imgStatus = status
        // }) 
        fetch(url).
        then(function(response) {
            console.log(response.status); // returns 200
            response.blob()
        .then(function(myBlob) {
              var objectURL = URL.createObjectURL(myBlob);
              return objectURL
              myImage.src = objectURL;
            })
        })
    } else {
        return false
    }
}

function article_html(article){
    let status
    checkImg(article.urlToImage, status)
    console.log(status)
    published = new Date(article.publishedAt).toLocaleString()
    img = article.urlToImage?article.urlToImage:'assets/img/placeholder-image.png'
    return `<article class="row">
    <div class="col-4 image"><img src="${img}" alt="picture"></div>
    <div class="col-8 content d-flex flex-column">
        <h3>${article.title}</h3>
        <p><span class="author">${article.author?article.author:''}</span> <span class="published">${published}</span></p>
        <p class="description">${article.description?article.description:''}</p>
        <a href="${article.url}" class="btn btn-link align-self-end" target="_blank">Читати більше на ${article.source.name}"</a>
    </div>
    </article>`
}

function loadNews(category=''){
    let country = 'ua',
        country_q = ``,
        category_q = category?`&category=${category}`:''
    let url = `https://newsapi.org/v2/top-headlines?country=${country}${category_q}&pageSize=20&apiKey=f210154948eb4e6e89d98eb5582468a7`

    fetch(url)
    .then(response=>response.json())
    .then(data=>{
        console.log(data['articles'])
        let $news =  document.querySelector('main.news')
        $news.innerHTML=''
        for(article of data['articles']){
            $news.insertAdjacentHTML('beforeend', article_html(article))
        }
    })
    .catch(error=>{
        console.error('Error: ', error)
    })
}

function addButtons(){
    let $buttons = document.querySelector('.buttons')
    for(item in category_list){
        let btn = document.createElement('BUTTON')
        btn.classList.add('btn','btn-primary')
        btn.textContent = category_list[item].toUpperCase()   
        btn.dataset.category = item
        $buttons.append(btn)
    }
    let $button_list = document.querySelectorAll('.buttons button')
    for(let i=0; i<$button_list.length; i++){
        $button_list[i].addEventListener('click',()=>{
            loadNews($button_list[i].dataset.category)
        })
    }
}
addButtons()
loadNews('general');



const api = "https://api.exchangerate-api.com/v4/latest/USD";
  
// for selecting different controls
var search = document.querySelector(".searchBox");
var convert = document.querySelector(".convert");
var fromCurrecy = document.querySelector(".from");
var toCurrecy = document.querySelector(".to");
var finalValue = document.querySelector(".finalValue");
var finalAmount = document.getElementById("finalAmount");
var resultFrom;
var resultTo;
var searchValue;
  
// Event when currency is changed
fromCurrecy.addEventListener('change', (event) => {
    resultFrom = `${event.target.value}`;
});
  
// Event when currency is changed
toCurrecy.addEventListener('change', (event) => {
    resultTo = `${event.target.value}`;
});
  
search.addEventListener('input', updateValue);
  
// function for updating value
function updateValue(e) {
    searchValue = e.target.value;
}
  
// when user clicks, it calls function getresults 
convert.addEventListener("click", getResults);
  
// function getresults
function getResults() {
    fetch(`${api}`)
        .then(currency => {
            return currency.json();
        }).then(displayResults);
}
  
// display results after convertion
function displayResults(currency) {
    let fromRate = currency.rates[resultFrom];
    let toRate = currency.rates[resultTo];
    finalValue.innerHTML = 
       ((toRate / fromRate) * searchValue).toFixed(2);
    finalAmount.style.display = "block";
}
  
// when user click on reset button
function clearVal() {
    window.location.reload();
    document.getElementsByClassName("finalValue").innerHTML = "";
};
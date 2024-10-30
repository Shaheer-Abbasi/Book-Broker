import React from 'react'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
//import { Select } from '@mui/base/Select'
//import { Option } from '@mui/base/Option'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import './App.css'
import Card from './Card.jsx'

/*
* ------------------- TO-DO------------------------------------
* 1. Select Component - MUI, React-Select, Custom
* 4. Add API switching functionality (give HaremRec special deployment of app)
* 5. add project to GitHub
*--------------------------------------------------------------
*/

function App() {
  const [inputValue, setInputValue] = useState('')
  const [res, setRes] = useState([])
  const [amount, setAmount] = useState('None')
  const [method, setMethod] = useState(1)
  const [apiType, setApiType] = useState('Google Books')
  const [bookData, setBookData] = useState({
    Title: "",
    Author: "",
    ImageUrl: "",
    URL: "",
    Rating: "",
    Categories: "",
    Description: ""
  })
  const [subbredditName, setSubbredditName] = useState('')
  const [keyword, setKeyword] = useState('')
  const [redditData, setRedditData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [after, setAfter] = useState('')
  const [before, setBefore] = useState('')

  let index = useRef(0)
  
  const update = () => {

    //https://www.googleapis.com/books/v1/volumes?q=Heretic-Spellblade&key=
    const baseGoogleUrl = 'https://www.googleapis.com/books/v1/volumes?q='
    const googleBooksKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
    //https://data.unwrangle.com/api/getter/?platform=amazon_search&search=K D Robertson&country_code=us&page=1&api_key=
    const baseAmazonUrl = 'https://data.unwrangle.com/api/getter/?platform=amazon_search&search='
    const amazonKey = import.meta.env.VITE_AMAZON_API_KEY
    
    let url = ''

    if(setApiType === 'Google Books') {
      url = `${baseGoogleUrl}${inputValue}&key=${googleBooksKey}`
    } else if(setApiType === 'Amazon') {
      url = `${baseAmazonUrl}${inputValue}&country_code=us&page=1&api_key=${amazonKey}`
    } else {
      url = `${baseGoogleUrl}${inputValue}&key=${googleBooksKey}`
    }
    
    if(inputValue.length > 0 && apiType === 'Google Books') {
      axios.get(url)
        .then(response => {
          console.log("Get Request Initiated")
          handleResponse(response['data'], [])
          setRes(response['data']['items'])
          setAmount(response['data']['items'].length)
          index.current = 0
        })
        .catch(error => {
          console.error(error)
      })
    }
  }

  const redditUpdate = () => {
    if(subbredditName) {
      axios.get(`https://api.reddit.com/r/${subbredditName}/new.json`)
      .then(resp => {
        setRedditData(resp['data']['data']['children'])
        console.log(redditData)
        filter(redditData, keyword)
      })
      .catch(error => {
        console.error(error)
      })
    } 
  }

  useEffect(redditUpdate, [])

  
  const filter = (APIResponse, keyword) => {
    let filteredArray = []
    if(keyword.length === 0) {
      return
    } else {
      APIResponse.forEach((item) => {
        if(item['data']['selftext'].includes(keyword)) {
          filteredArray.push(item)
        }
      })
    }
    setFilteredData(filteredArray)
    console.log(filteredArray)
  }

  const displayReccs = () => {
    if(subbredditName.length > 0 && filteredData.length > 0) {
      return (
        <div className='reccContainer'>
        {filteredData.map((item) => (
          <div className='itemDiv'>
            {item['data']['url']}
          </div>
        ))}
        </div>
      )
    }
    return (
      <>
      </>
    )
  }
  

  /*
  *do not include 'limit' in search
  *2 fields -> 1st get subreddit name -> then .include key word
  *2 buttons -> one for before and after
  useEffect(() => {
    axios.get('https://api.reddit.com/r/books/new.json?after=t3_1gbef16')
      .then(resp => {
        console.log('reddit stuff here')
        console.log(resp['data'])
      })
      .catch(error => {
        console.error(error)
      })
  }, [])
  */

  function handleResponse(response, itemsArray) {
    if(response) {
      let accessor = response['items'][0]['volumeInfo']
      setBookData({
        Title: accessor['title'],
        Author: accessor['authors'][0],   
        ImageUrl: accessor['imageLinks']['thumbnail'],
        URL: accessor['infoLink'],
        Rating: accessor['averageRating'],
        Categories: accessor['categories'][0],
        Description: accessor['description']
      })
    } else if(response === 0 && itemsArray.length > 0 && index.current < itemsArray.length) {
      let newAccessor = itemsArray[index.current]['volumeInfo']
      setBookData({
        Title: newAccessor['title'],
        Author: newAccessor['authors'][0],   
        ImageUrl: newAccessor['imageLinks']['thumbnail'],
        URL: newAccessor['infoLink'],
        Rating: newAccessor['averageRating'],
        Categories: newAccessor['categories'][0],
        Description: newAccessor['description']
      })
    }
  }

  const apiSelectDropdown = () => {
    const options = [
     {value: "Poop", label: "Poop"},
     {value: "Google Books", label: "Google Books"}
    ]

    return (
      <select className='dropdown'
        value={apiType}
        onChange={(e) => setApiType(e.target.value)}
      >
        {options.map((option) =>(
          <option style={{ cursor: 'pointer' }} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
     )
 }

  useEffect(update, [])

  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      update()
    }
  }

  const increaseIndex = () => {
    console.log("Reached increaseIndex")
    if(index.current === res.length - 1) {
      handleResponse(0, res)
      return
    } else if(index.current < res.length) {
      index.current = index.current + 1
      handleResponse(0, res)
    }
  }

  const decreaseIndex = () => {
    console.log("Reached decreaseIndex")
    if(index.current > 0) {
      index.current = index.current - 1
      handleResponse(0, res)

    }
  }

  const handleSubForm = (e) => {
    if(e.key === 'Enter') {
      console.log(subbredditName)
      redditUpdate()
    }
  }

  const handleKeyWordForm = (e) => {
    if(e.key === 'Enter') {
      console.log(keyword)
      redditUpdate()
    }
  }

  /*
  const handleReccClick = () => {
    redditUpdate()
  }
  */

  const generateCard = () => {
     if(bookData['Title']) {
      return( 
        <div className='cardContainer'>
          <div className='buttonContainer'>
            <button className='leftBtn' 
                    onClick={() => decreaseIndex()} 
                    style={ index.current === 0 ? { backgroundColor: '#646cff', disabled: true, cursor: 'not-allowed' } 
                                                : { backgroundColor: '#1a1a1a', disabled: 'false'}} >
                    <FontAwesomeIcon icon={faArrowLeft}/>
            </button>
            <button className='rightBtn' 
                    onClick={() => increaseIndex()} 
                    style={ index.current === res.length - 1? { backgroundColor: '#646cff', disabled: true, cursor: 'not-allowed' } 
                                        : { backgroundColor: '#1a1a1a', disabled: 'false'}} >
                    <FontAwesomeIcon icon={faArrowRight}/>
            </button>
          </div>
          
          <Card 
            Title={bookData.Title}
            Author={bookData.Author}
            ImageUrl={bookData.ImageUrl}
            URL={bookData.URL}
            Rating={bookData.Rating}
            Categories={bookData.Categories}
            Description={bookData.Description}
          />
        </div>
      )
     }
     return(
      <>
      </>
     )
  }

  return (
    <>
      <div className='navBar'>
        <div 
          className='bookSearchHeading'
          onClick={() => setMethod(1)}
          style = { method === 1 ? { opacity: 0.5} : { opacity: 1 }}
        >
          <h1>
            Book Search
          </h1>
        </div>
        
        <div 
          className='reccHeading'
          onClick={() => setMethod(2)}
          style = { method === 2 ? { opacity: 0.5} : { opacity: 1 }}
        >
          <h1>
            Reddit Reccomendations
          </h1>
        </div>
      </div>

      <div 
        className='mainDiv'
        style={ method === 2 ? { display:'none' } : { display:'block' }}
      >
        <div className='search-container'>
          {apiSelectDropdown()}
          <input placeholder='Enter Book Title Or Author'
                 value={inputValue} 
                 onChange={(e) => setInputValue(e.target.value)}
                 onKeyDown={(e) => handleKeyDown(e)}
          >
          </input>
          <button onClick={() => update()}>
            Search! <FontAwesomeIcon style={{ marginLeft: '0.7rem '}}icon={faMagnifyingGlass} />
          </button>
        </div>
        <span>Search Results: {amount} Books</span>

        {generateCard()}
      </div>

      <div 
        className='reccDiv' 
        style={ method === 2 ? {display: 'block'} : {display: 'none'}}
      >

        <div className='infoText'>
          <h4>Some subreddits for books are: r/books, r/literature, r/ProgressionFantasy, & r/lightnovels</h4>
          <p>Enter the subreddit name first, then press the button to search!</p>
        </div>

        <div className='inputContainer'>
          <input 
            placeholder='Enter Subreddit Name After "r/"'
            value={subbredditName}
            onChange={(e) => setSubbredditName(e.target.value)}
            onKeyDown={(e) => handleSubForm(e)}
          >
          </input>
          <input 
            placeholder='Enter Key Word e.x. "reccomendations"'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => handleKeyWordForm(e)}
            disabled={subbredditName.length === 0}
            style={subbredditName.length === 0 ? {cursor:'not-allowed'} : {cursor: 'auto'}}
          >
          </input>
          
          {/*
          <button onClick={() => handleReccClick()}>
            Search! <FontAwesomeIcon style={{ marginLeft: '0.7rem '}}icon={faMagnifyingGlass} />
          </button>
          */}

        </div>
        
        <button className='leftBtn' 
                    onClick={() => decreaseIndex()} 
                    style={ index.current === 0 ? { backgroundColor: '#646cff', disabled: true, cursor: 'not-allowed' } 
                                                : { backgroundColor: '#1a1a1a', disabled: 'false'}} >
                    <FontAwesomeIcon icon={faArrowLeft}/>
            </button>
            <button className='rightBtn' 
                    onClick={() => increaseIndex()} 
                    style={ index.current === res.length - 1? { backgroundColor: '#646cff', disabled: true, cursor: 'not-allowed' } 
                                        : { backgroundColor: '#1a1a1a', disabled: 'false'}} >
                    <FontAwesomeIcon icon={faArrowRight}/>
        </button>

        {displayReccs()}

      </div>
    </>
  )
}

export default App

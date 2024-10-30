import React from 'react'
import './App.css'

export default function Card({ Title, Author, ImageUrl, URL, Rating, Categories, Description }) {
  //console.log({Title})
  //console.log({Author})
  //console.log(typeof ImageUrl)
  //console.log({URL})
  //console.log({Rating})
  //console.log({Categories})
  //console.log({Description})
  return (
    <div className='bookCard'>

      <div className='upperParent'>
        <div className='coverParent'>
          <div className='coverInfo'>
            <h1>Title: {Title}</h1>
            <h2>Author: {Author}</h2>
          </div>
          <div className='imageContainer'>
            <img 
              src={ImageUrl}
              alt="Thumbnail Image"
            />
          </div>
        </div>

        <div className='infoParent'>
          <div style={{ flexDirection: 'column'}} className='infoContainer'>
            <h1>URL: <a href={URL} target='_blank'>Link</a></h1>
            <p>{URL}</p>
          </div>
          <div className='infoContainer'>
            <h1>Rating: {Rating}</h1>
          </div>
          <div className='infoContainer'>
            <h1>Categories: {Categories}</h1>
          </div>
        </div>
      </div>

      <div className='lowerParent'>
        <div className='descriptionDisplay'>
          <h3>Description: </h3>
          <p>{Description}</p>
        </div>
      </div>

    </div>
  )
}
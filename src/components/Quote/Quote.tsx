import { useEffect, useState } from "react";
import axios from 'axios'
import { QuoteModel } from "../../types/Quote";
import './Quote.css'

export default function Quote() {
  const [quote, setQuote] = useState<QuoteModel>()
  const randomQuoteIndex = Math.floor(Math.random() * 1642);
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchQuote()
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await axios.get("https://type.fit/api/quotes")
      setLoading(false)
      const todayQuote = response.data[randomQuoteIndex]
      setQuote({ content: todayQuote.text, author: todayQuote.author })
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="quote">
      <div className="quote__heading">
        {loading && 'Today inspiring quote is...'}
        {!loading && `"${quote?.content ?? 'Some thing broke'}"`}
      </div>
      <div className="author">
        - {quote?.author} -
      </div>
    </div>
  )
}
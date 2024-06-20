import { useState, useEffect } from 'react'

// Styles
import './App.css'

// Components
import Guest from './components/Guest'
import GuestForm from './components/GuestForm'
import Search from './components/Search'

const url = "http://localhost:3000/guests"

function App() {
  const [guests, setGuests] = useState([])

  const [search, setSearch] = useState({
    name: "",
    type: ""
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url)
        const data = await res.json()
        localStorage.setItem('guests', JSON.stringify(data))
        const storageGuests = localStorage.getItem('guests')
        setGuests(JSON.parse(storageGuests))
      } catch (error) {
        const storageGuests = localStorage.getItem('guests')
        if (storageGuests) {
          setGuests(JSON.parse(storageGuests))
        }
        console.error('Erro ao buscar dados do servidor:', error)
      }
    }
    fetchData()
  }, [])


  async function update(newGuest) {
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newGuest)
      })
    } catch (error) {
      console.log("Erro ao realizar update", error)
    }
  }

  const addGuest = (guest, invitedFor) => {
    const newGuest = {
      id: `${Math.floor(Math.random() * 1000)}`,
      guest: guest,
      invitedFor: invitedFor,
      hasArrived: false
    }
    const updateGuests = [...guests, newGuest]
    setGuests(updateGuests)
    update(newGuest)
  }

  const removeGuest = async (id) => {
    try {
      await fetch(`${url}/${id}`, {
        method: 'DELETE'
      })

      const filteredGuests = guests.filter(guest => guest.id !== id)
      setGuests(filteredGuests)
      localStorage.setItem('guests', JSON.stringify(filteredGuests))
    } catch (error) {
      console.error('Erro ao deletar convidado:', error)
    }
  };

  const checkGuest = async (id) => {
    try {
      const updatedGuests = guests.map((guest) =>
        guest.id === id ? { ...guest, hasArrived: !guest.hasArrived } : guest
      )
      setGuests(updatedGuests)
      
      await fetch(`${url}/${id}`, {
        method: 'DELETE'
      })

      const data = updatedGuests.filter((guest) => guest.id === id)
      console.log(data)
      
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data[0])
      })

    } catch (error) {
      console.error('Erro ao deletar convidado')
    }
  };

  return (
    <div className='app'>
      <h1>Convidados</h1>
      <Search search={search} setSearch={setSearch} />
      <div className="guests-list">
        {guests.filter((list) => {
          const name = search.name.toLowerCase();
          if (search.type === 'whoInvited' && list.invitedFor) {
            return list.invitedFor.toLowerCase().includes(name);
          } else if (list.guest) {
            return list.guest.toLowerCase().includes(name);
          }
          return false;
        }).map((list) => (
          <Guest list={list} key={list.id} removeGuest={removeGuest} checkGuest={checkGuest} />
        ))}
      </div>
      <GuestForm guests={guests} addGuest={addGuest} />
    </div>
  )
}

export default App

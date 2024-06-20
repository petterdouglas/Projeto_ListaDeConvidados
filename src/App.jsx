import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { collection, getFirestore, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore'

// Styles
import './App.css'

// Components
import Guest from './components/Guest'
import GuestForm from './components/GuestForm'
import Search from './components/Search'

//configuração Firebase
const firebaseApp = initializeApp({
  apiKey: "AIzaSyD5ArDrbOly_6BGhBXRR7pHkKvt4TxoeqU",
  authDomain: "lista-de-convidados-cd20e.firebaseapp.com",
  projectId: "lista-de-convidados-cd20e",
})

function App() {

  const [guests, setGuests] = useState([])

  const [search, setSearch] = useState({
    name: "",
    type: ""
  })

  const db = getFirestore(firebaseApp)
  const useCollectionRef = collection(db, "guests-list")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDocs(useCollectionRef)
        localStorage.setItem('guests', JSON.stringify(data.docs.map((guest) => ({ ...guest.data(), id: guest.id }))))
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
  const addGuest = async (guest, invitedFor) => {
    const newGuest = {
      id: `${Math.floor(Math.random() * 1000)}`, // Gera um ID único (você pode usar outra estratégia para gerar IDs únicos)
      guest: guest,
      invitedFor: invitedFor,
      hasArrived: false
    }

    try {
      await setDoc(doc(db, "guests-list", newGuest.id), newGuest);
      setGuests([...guests, newGuest]);
      localStorage.setItem('guests', JSON.stringify([...guests, newGuest]));
    } catch (error) {
      console.error("Erro ao adicionar convidado:", error);
    }
  }

  const removeGuest = async (id) => {
    try {

      await deleteDoc(doc(db, "guests-list", id))

      const filteredGuests = guests.filter(guest => guest.id !== id)
      setGuests(filteredGuests)
      localStorage.setItem('guests', JSON.stringify(filteredGuests))
    } catch (error) {
      console.error('Erro ao deletar convidado:', error)
    }
  };

  const checkGuest = async (id) => {
    const updatedGuests = guests.map((guest) =>
      guest.id === id ? { ...guest, hasArrived: !guest.hasArrived } : guest
    )
    setGuests(updatedGuests)
    localStorage.setItem('guests', JSON.stringify([updatedGuests]));

    try {
      await deleteDoc(doc(db, "guests-list", id))
    } catch (error) {
      console.error('Erro ao deletar convidado:', error)
    }

    const data = updatedGuests.filter((guest) => guest.id === id)
    console.log(data[0])
    try {
      await setDoc(doc(db, "guests-list", data[0].id), data[0]);
    } catch (error) {
      console.error("Erro ao adicionar convidado:", error);
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

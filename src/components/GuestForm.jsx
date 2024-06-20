// Hooks
import { useState } from "react"

const GuestForm = ({ guests, addGuest }) => {

    const [value, setValue] = useState('')
    const [invitedFor, setInvitedfor] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!value || !invitedFor) return
        addGuest(value, invitedFor)
        localStorage.setItem('guests', JSON.stringify(guests))
        //limpar inputs
        setValue("")
        setInvitedfor("")
    }

    return (
        <div className="guest-form">
            <h2>Adicionar Convidado:</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='Nome do convidado' onChange={(e) => setValue(e.target.value)} value={value} />
                <select onChange={(e) => setInvitedfor(e.target.value)} value={invitedFor}>
                    <option key="-1" value="">Convidado por</option>
                    {guests.map((list) => (<option key={list.id} value={list.guest}>{list.guest}</option>))}
                    <option key="-2" value="Ninguém"></option>
                </select>
                <button type="submit">Adicionar</button>
            </form>
        </div>
    )
}

export default GuestForm
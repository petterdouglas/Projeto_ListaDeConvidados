// Hooks
import React from 'react'
import { useState } from "react"

const GuestForm = ({ guests, addGuest }) => {

    const [value, setValue] = useState('')
    const [invitedFor, setInvitedfor] = useState('')
    const [customInvitedFor, setCustomInvitedfor] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!value || !invitedFor) return
        if (invitedFor === 'anotherOption') {
            addGuest(value, customInvitedFor)
            localStorage.setItem('guests', JSON.stringify(guests))
        } else {
            addGuest(value, invitedFor)
            localStorage.setItem('guests', JSON.stringify(guests))
        }
        //limpar inputs
        setValue("")
        setInvitedfor("")
        setCustomInvitedfor("")
    }

    const handleCustomInvitedFor = () => {
        return <div><input type="text" placeholder="Insira a pessoa que convidou..." onChange={(e) => setCustomInvitedfor(e.target.value)} value={customInvitedFor} /></div>
    }

    const oi = "23"

    return (
        <div className="guest-form">
            <h2>Adicionar Convidado:</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='Nome do convidado' onChange={(e) => setValue(e.target.value)} value={value} />
                <select onChange={(e) => setInvitedfor(e.target.value)} value={invitedFor}>
                    <option key="-1" value="">Convidado por</option>
                    {guests.map((list) => (
                        <React.Fragment key={list.id}>
                            <option value={list.guest}>{list.guest}</option>
                            <option value={list.invitedFor}>{list.invitedFor}</option>
                        </React.Fragment>
                    ))}
                    <option key="-2" value="anotherOption">Inserir outra pessoa</option>
                </select>
                {invitedFor === "anotherOption" ? handleCustomInvitedFor() : null}
                <button type="submit">Adicionar</button>
            </form>
        </div>
    )
}

export default GuestForm
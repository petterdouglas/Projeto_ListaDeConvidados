const Guest = ({ list, removeGuest, checkGuest }) => {

    const handleAlert = () => {
        const resposta = window.confirm("Tem certeza que deseja excluir o convidado?")
        if (resposta) {
            removeGuest(list.id)
        } else{
            return false
        }
    }
    return (
        <>
            <div className={list.hasArrived === false ? "list" : "list_checked"}>
                <div className="content">
                    <p className={list.hasArrived === false ? 'guestName' : 'guestName_checked'} style={{ fontWeight: 'bold' }}>
                        {list.guest}
                    </p>
                    <p className={list.hasArrived === false ? 'guest' : 'guestName_checked'}>
                        Convidado(a) de: {list.invitedFor}
                    </p>
                </div>
                <div className="btn_container">
                    <button className={list.hasArrived === true ? 'img_btn_check' : "img_btn"} onClick={() => checkGuest(list.id)}></button>
                    <button className='img_btn_remove' onClick={() => handleAlert()}></button>
                </div>
            </div>
        </>
    )
}

export default Guest
//Hooks
import { useState } from "react"

const Search = ({ search, setSearch }) => {

    const [type, setType] = useState('')

    return (
        <div>
            <h2 className="search_title">Pesquisar: </h2>
            <div className="search_section">
                <div className="search_filter-container">
                    <p className='search_cap'>Filtrar por:</p>
                    <select className="search_opt" onChange={(e) => setType(e.target.value)}>
                        <option value=""></option>
                        <option value="guest">Nome do Convidado</option>
                        <option value="whoInvited">Quem convidou</option>
                    </select>
                </div>
                <input type="text" value={search.name} onChange={(e) => setSearch({
                    name: e.target.value,
                    type: type
                })} disabled={type === '' ? true : false} placeholder='Digite para pesquisar...' />
            </div>
        </div>
    )
}

export default Search
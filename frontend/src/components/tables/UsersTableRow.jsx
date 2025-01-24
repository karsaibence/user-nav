import React, { useEffect, useState } from 'react';
import { myAxios } from '../../api/Axios';
import useAuthContext from '../../contexts/AuthContext';

const UsersTableRow = ( props ) => {
    const [ role, setRole ] = useState( props.e.role_name );

    const handleChange = async ( event ) => {
        const newRole = event.target.value; // Az új szerepkör közvetlenül az event-ből
        setRole( newRole ); // Az állapotot frissítjük
        await fetchUserRoleData( newRole ); // A fetchUserRoleData hívása az új role-al
    }

    const fetchUserRoleData = async ( newRole ) => {
        let id;
        props.role.forEach( ( e ) => {
            if ( newRole === e.megnevezes ) {
                id = e.id;
            }
        } );

        if ( id ) {
            const response = await myAxios.put( `/update-user-role/${ props.e.user_id }`, {
                id: id
            } );

            // További logikát is adhatsz a válasz kezelésére, pl. sikeres frissítés esetén
            console.log( response.data );
        }
    }

    return (
        <tr>
            <td>{props.e.user_name}</td>
            <td>
                <form>
                    <select value={role} onChange={handleChange}>
                        {
                            props.role.map( ( e, i ) => (
                                <option value={e.megnevezes} key={i}>
                                    {e.megnevezes}
                                </option>
                            ) )
                        }
                    </select>
                </form>
            </td>
        </tr>
    )
};

export default UsersTableRow;

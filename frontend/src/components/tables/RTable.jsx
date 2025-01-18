import React from 'react'
import { Table } from 'react-bootstrap'
import useAuthContext from '../../contexts/AuthContext';
import TableRow from './TableRow';

const RTable = ( props ) => {
    const { navsByRole } = useAuthContext();
    
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    {
                        <th colSpan={2}>{props.role}</th>
                    }
                </tr>
            </thead>
            <tbody>
                {
                    navsByRole.map( ( e ) => {
                        return <TableRow sorszam={e.sorszam} nev={e.nav_name} />
                    } )
                }
            </tbody>
        </Table>

    )
}

export default RTable
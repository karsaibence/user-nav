import { Table } from 'react-bootstrap';
import TableRow from './TableRow';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { myAxios } from '../../api/Axios';
import useAuthContext from '../../contexts/AuthContext';


const Tables = ( props ) => {
    const [ items, setItems ] = useState( [] ); // Kezdetben üres tömb

    useEffect( () => {
        const fetchData = async () => {
            try {
                const response = await myAxios.get( '/get-nav-items-with-roles' );
                if ( response.data ) {
                    setItems( response.data );  // API válaszának beállítása
                } else {
                    console.log( 'No data returned from API' );
                }
            } catch ( error ) {
                console.error( 'Error fetching nav items:', error );
            }
        };

        fetchData();
    }, [] );

    const onDragEnd = async ( result ) => {
        const { destination, source } = result;

        // Ha a cél pozíció érvényes, átrendezzük a sorokat
        if ( !destination ) return;

        const reorderedItems = Array.from( items );
        const [ removed ] = reorderedItems.splice( source.index, 1 ); // Kivesszük a forrást
        reorderedItems.splice( destination.index, 0, removed ); // Beszúrjuk a célt

        // Frissítjük a state-et
        setItems( reorderedItems );

        console.log( 'Items:', items );
        console.log( 'Reordered items:', reorderedItems );

        console.log( 'Sending items:', reorderedItems.map( ( item, index ) => ( {
            nav_id: item.nav_id,
            role_id: item.role_id,
            sorszam: index + 1, // Az új sorszám
        } ) ) );

        try {
            // A sorrendet frissítjük az adatbázisban is
            const response = await myAxios.post( "/update-nav", {
                items: reorderedItems.map( ( item, index ) => ( {
                    nav_id: item.nav_id, // Nav ID biztosítása
                    role_id: item.role_id, // Role ID biztosítása
                    sorszam: index + 1, // Az új sorszám
                } ) ),
            } );

            // Itt frissítheted az items állapotot a válaszból, ha szükséges
            setItems( response.data ); // Példa arra, hogy a válaszban lévő adatokat újra beállítjuk
        } catch ( error ) {
            console.error( "Error updating order:", error );
        }
    };

    /*
    const onDragEnd = async ( result ) => {
        const { destination, source } = result;

        // Ha a cél pozíció érvényes, átrendezzük a sorokat
        if ( !destination ) return;

        const reorderedItems = Array.from( items );
        const [ removed ] = reorderedItems.splice( source.index, 1 ); // Kivesszük a forrást
        reorderedItems.splice( destination.index, 0, removed ); // Beszúrjuk a célt

        // Frissítjük a state-et
        setItems( reorderedItems );

        // A sorrendet frissítjük az adatbázisban is
        // A sorrendet frissítjük az adatbázisban is
        try {
            const response = await myAxios.post( "/update-nav", {
                items: reorderedItems.map( ( item, index ) => ( {
                    nav_id: item.nav_id, // itt biztosítani kell, hogy a nav_id is szerepel
                    role_id: item.role_id, // és role_id is benne legyen
                    sorszam: index + 1 // Az új sorszám
                } ) ),
            } );

            // Itt frissítheted az items állapotot a válaszból, ha szükséges
            setItems( response.data ); // Példa arra, hogy a válaszban lévő adatokat újra beállítjuk
        } catch ( error ) {
            console.error( "Error updating order:", error );
        }
    };
*/
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {( provided ) => (
                    <Table className='table' striped bordered hover {...provided.droppableProps} ref={provided.innerRef}>
                        <thead>
                            <tr>
                                <th colSpan={2}>{props.nev}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                items.map( ( e, i ) => {
                                    if ( e.role_name === props.nev )
                                        return (
                                            <Draggable key={e.id} draggableId={String( i )} index={i}>
                                                {( provided ) => (
                                                    <tr
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <td>{e.sorszam}</td>
                                                        <td>{e.nav_name}</td>
                                                    </tr>
                                                )}
                                            </Draggable>
                                        )
                                } )
                            }
                        </tbody>
                    </Table>
                )}
            </Droppable>
        </DragDropContext>
    )
}


export default Tables
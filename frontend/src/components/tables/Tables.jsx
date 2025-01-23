import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TableRow from "./TableRow";
import "./roletables.css";
import { myAxios } from "../../api/Axios";

const Tables = (props) => {
  const [items, setItems] = useState(props.lista);

  useEffect(() => {
    setItems(props.lista); // Frissítjük a lista tartalmát
  }, [props.lista]);

  // Drag-and-drop eseménykezelő
  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination) return; // Ha nincs érvényes cél, nem csinálunk semmit

    // Átrendezzük az elemeket
    const reorderedItems = Array.from(props.lista);
    const [removed] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, removed);

    setItems(reorderedItems);
    props.onUpdateNavOrder(props.nev, reorderedItems); // Az új sorrendet továbbítjuk

    // Backend frissítése (ha szükséges)
    try {
      const response = await myAxios.put("/update-nav", {
        items: reorderedItems,
      });
      console.log("Updated order (response):", response.data);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={props.nev}>
        {(provided) => (
          <Table
            className="table"
            striped
            bordered
            hover
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <thead>
              <tr>
                <th>{props.nev}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e, i) => {
                if (props.nev === e.role_name) {
                  return (
                    <Draggable key={e.id} draggableId={String(e.id)} index={i}>
                      {(provided) => (
                        <>
                          <TableRow provided={provided} e={e} />
                          {provided.placeholder}
                        </>
                      )}
                    </Draggable>
                  );
                }
              })}
            </tbody>
          </Table>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Tables;

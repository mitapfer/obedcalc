import {GenerateColumn, Table} from "./table";
import {model} from "./table/model.ts";
import {observer} from "mobx-react-lite";

function App() {

  return (
    <>
      {
        model.rows.length > 0
        ?
          <Table />
          :
          <GenerateColumn />
      }
    </>
  )
}

export default observer(App)

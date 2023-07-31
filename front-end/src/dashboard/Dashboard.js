import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationCard from "../reservations/ReservationCard";
import TableCard from "../table/TableCard";
import { formatAsDate, next, previous } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [loading, setLoading] = useState(false);
  const param = new URLSearchParams(window.location.search).get('date');
  const [selectedDate, setSelectedDate] = useState(param? param: formatAsDate(date));


  useEffect(()=>{
    const abortController = new AbortController();

    async function loadDashboard() {
      
      try{ 
        setReservationsError(null);
        const queryParams = new URLSearchParams(window.location.search);
        
        const response = await listReservations({ date: queryParams.get('date')? queryParams.get('date'): date }, abortController.signal);
        setReservations(response);

        const tableResponse = await listTables(abortController.signal);
        setTables(tableResponse);
      }catch(e){
        setReservationsError({error: "Couldn't load the records"});
      }
      
    }

    loadDashboard();

    return () => abortController.abort()
  }, [date]);

  async function nextDay() {

    if(loading === false){

      const abortController = new AbortController();
      try{

        setLoading(true);
        const nextDay = next(selectedDate);
        setSelectedDate(nextDay);

        const response = await listReservations({ date: nextDay }, abortController.signal);
        setReservations(response);
      }catch(e){
        console.log(e)
        setReservationsError({message: "Couldn't load the records"});
      }

      setLoading(false);
    }
    
    
  }

  async function previousDay() {

    if(loading === false){

      const abortController = new AbortController();
      try{

        setLoading(true);
        const previousDay = previous(selectedDate);
        setSelectedDate(previousDay);

        const response = await listReservations({ date: previousDay }, abortController.signal);
        setReservations(response);
      }catch(e){
        console.log(e)
        setReservationsError({message: "Couldn't load the records"});
      }

      setLoading(false);
    }
    
    
  }

  async function refresh() {
    const abortController = new AbortController();
    try{
      setReservationsError(null);
      const response = await listReservations({ date }, abortController.signal);
      setReservations(response);

      const tableResponse = await listTables(abortController.signal);
      setTables(tableResponse);
    }catch(e){
      setReservationsError({error: "Couldn't load the records"});
    }
    
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex">
        <h4 className="mb-0">Reservation</h4>
      </div>
      <div>
      <button className="btn blue" disabled={loading} onClick={previousDay}>Previous day</button>
      { selectedDate}
      <button className="btn blue" disabled={loading} onClick={nextDay}>Next day</button>

      </div>

      <ErrorAlert error={reservationsError} />
      {
        reservations.map( (item)=> <ReservationCard refresh={refresh} key={item.reservation_id} data={item}/> )
      }

      <h1>Tables</h1>
      <div className="d-md-flex mb-3">
      {
        tables.map( (item)=><TableCard refresh={refresh} key={item.table_id} data={item}/>)
      }
      </div>
    </main>
  );
}

export default Dashboard;

import React,{useState} from 'react'
import { useAsyncDebounce } from 'react-table'

export const GlobalFilter = ({filter, setFilter}) => {
  const [value, setValue] = useState(filter);
  const onChange = useAsyncDebounce(value=>{
    setFilter(value||undefined)}, 100);
  
  return (
    <div className='global-search'>
        Search by name or team name : {'  '}
        <input value = {value ||''} 
        onChange={e=>{
          setValue(e.target.value);
          onChange(e.target.value)
          }}></input>
    </div>
  )
}

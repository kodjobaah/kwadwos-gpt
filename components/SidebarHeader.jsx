import ThemeToggle from "./ThemeToggle";
import {SiOpenaigym} from 'react-icons/si';

const SidebarHeader = () => {
  return (
    <div className='flex items-center mb-4 gap-4 px-4'>
        <SiOpenaigym className='w-10 h-10 text-primary' />
        <h2 className='text-l font-extrabold text-primary mr-auto'>Kwadwos GPT</h2>
        <ThemeToggle/>
        
    </div>
  )
}

export default SidebarHeader
import { toast } from 'react-toastify';

type Props = {
  type: 'success' | 'error';
  message: string;
}

const Notify = ({ type, message }: Props) => {
  toast[type](message, { autoClose: 1000 })
}

export default Notify
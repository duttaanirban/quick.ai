import { useEffect, useState } from 'react'
import {useUser, useAuth} from '@clerk/clerk-react'
import { dummyPublishedCreationData } from '../assets/assets'
import { Heart } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Community = () => {


  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
  const [creations, setCreations] = useState([])
  const {user} = useUser()
  const [loading, setLoading] = useState(true)

  const {getToken} = useAuth()

  const fetchCreations = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get('/api/user/get-published-creations', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (data.success) {
        setCreations(data.creations || dummyPublishedCreationData)
      } else {
        toast.error(data.message || 'Failed to fetch creations')
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message || 'Failed to fetch creations')
    }
    setLoading(false)
  }

  const imageLikeToggle = async (id) => {
    // Optimistically update UI
    setCreations((prev) => prev.map((creation) => {
      if (creation.id !== id) return creation;
      const userIdStr = user.id.toString();
      let newLikes;
      if (creation.likes.includes(userIdStr)) {
        newLikes = creation.likes.filter((uid) => uid !== userIdStr);
      } else {
        newLikes = [...creation.likes, userIdStr];
      }
      return { ...creation, likes: newLikes };
    }));
    // Show loading toast immediately
    const toastId = toast.loading('Updating like...');
    try {
      const {data} = await axios.post('/api/user/toggle-like-creation', {id}, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })
      if (data.success) {
        toast.success(data.message || 'Like toggled successfully', { id: toastId });
      } else {
        toast.error(data.error || 'Failed to toggle like', { id: toastId });
        // Revert optimistic update on error
        await fetchCreations();
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message || 'Failed to toggle like', { id: toastId });
      // Revert optimistic update on error
      await fetchCreations();
    }
  }

  useEffect(() => {
    if (user) {
      fetchCreations()
    }
  },[user])

  return (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      Creations
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : (
        <div className='bg-white h-full w-full rounded-xl overflow-y-scroll'>
          {
            creations.map((creation, index) => (
              <div key={index} className='relative group inline-block pl-3 pt-3 w-full
              sm:max-w-1/2 lg:max-w-1/3'>
                <img src={creation.content} alt="" className='w-full h-full
                object-cover rounded-lg' />
                <div className='absolute bottom-0 top-0 right-0 left-3 flex gap-2
                items-end justify-end group-hover:justify-between p-3
                group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg'>
                  <p className='text-sm hidden group-hover:block'>{creation.prompt}</p>
                  <div className='flex gap-1 items-center'>
                    <p>{creation.likes.length}</p>
                    <Heart onClick={() => imageLikeToggle(creation.id)} className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${creation.likes.includes(user.id) ? 'fill-red-500 text-red-600' : 'text-white'}`}/>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  )
}

export default Community
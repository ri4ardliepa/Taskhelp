import { useContext, useEffect, useState } from "react"
import { AiFillHeart } from "react-icons/ai"
import useAuthentication from "../../hooks/useAuthentication"
import { useMutation } from "react-query"
import { useAuth0 } from "@auth0/auth0-react"
import UserDetailContext from "../../context/UserDetailContext"
import { checkFavourites, updateFavourites } from "../../utils/common"
import { toFav } from "../../utils/api"


const AddToFavourite = ({ id }) => {
    const [heartColor, setHeartColor] = useState("white")
    const { validateLogin } = useAuthentication()
    const { user } = useAuth0()

    const {
        userDetails,
        setUserDetails,
    } = useContext(UserDetailContext);

    useEffect(() => {
        setHeartColor(() => checkFavourites(id, userDetails.favourites))
    }, [userDetails.favourites])

    const { mutate } = useMutation({
        mutationFn: () => toFav(id, user?.email, userDetails.token),
        onSuccess: () => {
            setUserDetails((prev) => (
                {
                    ...prev,
                    favourites: updateFavourites(id, prev.favourites)
                }
            ))
        }
    })

    const handleLike = () => {
        if (validateLogin()) {
            mutate()
            setHeartColor((prev) => prev === "#fa3e5f" ? "white" : "#fa3e5f")
        }
    }

    return (
        <AiFillHeart size={24} color={heartColor} onClick={(e) => {
            e.stopPropagation()
            handleLike()
        }} />
    )
}

export default AddToFavourite
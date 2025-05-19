import {
  signInWithPopup,
  GoogleAuthProvider,
  inMemoryPersistence,
  setPersistence,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "./../../firebaseconfig";
import { LoginUser } from "../../features/userSlice";
const provider = new GoogleAuthProvider();

export const Login = async (dispatch) => {
  try {
    await setPersistence(auth, inMemoryPersistence);
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
    });

    dispatch(
      LoginUser({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
      })
    );
    return user;
  } catch (error) {
    console.log(error);
  }
};

export default Login;

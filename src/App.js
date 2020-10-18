import React,{ useState,useEffect } from 'react';
import './App.css';
import Post from './components/Post';
import {db,auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes=useStyles();
  const [modalStyle]=React.useState(getModalStyle);
  const [posts,setPosts]=useState([]);
  const [open,setOpen]=useState(false);
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [user,setUser]=useState(null);
  const [openSignin,setOpenSignIn]=useState(false);

  useEffect(()=>{
    const unsubscribe= auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      }else{
        //user has logged out
        setUser(null);
      }
    })
    return ()=>{
      //perform some cleanup actions before
      //detatche listener before you refire so we dont have repetitive 
      unsubscribe();
    }
  },[user,username]);

  useEffect(()=>{
    //this is where code runs for useeffect
    //onsnapshot is a listener
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>({
        id:doc.id,
        post:doc.data()})));
    })
  },[]);//runs every time the post changes if you do [posts] otherwise code runs once

  const signUp=(event)=>{
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error)=>alert(error.message));
    setOpen(false);//to shut the modal once you sign up
  }

  const signIn=(event)=>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message));
    setOpenSignIn(false);//to shut the modal once you sign in
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img 
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt=""
              />
            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="text"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignin}
        onClose={()=>setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img 
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt=""
              />
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="text"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app_header">
        <img 
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt=""
        />

        {user?(
          <Button onClick={()=>auth.signOut()}>Logout</Button>
        ):(
          <div className="app_loginContainer">
            <Button onClick={()=>setOpenSignIn(true)}>Sign in</Button>
            <Button onClick={()=>setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app_posts">
        <div className="app_postsLeft">
          {posts.map(({id,post})=>(
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))}

          {user?.displayName?(
            <ImageUpload username={user.displayName} />
          ):(
            <h3>Sorry,You need to log in to upload</h3>
          )}
        </div>
        <div className="app_postsRight">
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
        
      </div>
      
      

    </div>
  );
}

export default App;

import './App.css';
import React,{useState,useEffect} from 'react';
import axios from 'axios';


const CardList = (props) => (
	<div>
  	{props.profiles.map(profile => <Card key={profile.id} {...profile}/>)}
	</div>
);

class Card extends React.Component {
	render() {
  	const profile = this.props;
  	return (
    	<div className="github-profile">
    	  <img src={profile.avatar_url} alt="profile"/>
        <div className="info">
          <div className="name">{profile.name}</div>
          <div className="company">{profile.company}</div>
        </div>
    	</div>
    );
  }
}

const Form = (props) => {
  const handleSubmit = async (event) => {
  	event.preventDefault();
    const resp = await axios.get(`https://api.github.com/users/${userName}`);
    props.onSubmit(resp.data);
    setUserName('');;
  };

  const [users,setUsers] = useState([]);
  const [userName,setUserName] = useState('');
  const [suggestions,setsuggestions] = useState([]);

  useEffect(()=>{
    const loadUsers = async () => {
      const resp = await axios.get('https://api.github.com/users');
      setUsers(resp.data);
    }
    loadUsers();
  },[])

  const onChangeHandler = (name) => {
    let matches = [];
    if(name.length > 0){
        matches = users.filter(user =>{
          const regex = new RegExp(`${name}`,"gi");
          return user.login.match(regex);
        })
    }
    console.log(matches);
    setsuggestions(matches);
    setUserName(name);
  }

  const onSuggestHandler = (name) => {
    setUserName(name);
    setsuggestions([]);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={e=>onChangeHandler(e.target.value)}
          value={userName}
          placeholder="GitHub username"
          required
        />
      <button>Add card</button>
      </form>
      <div classNmae="list-group">
        {suggestions && suggestions.map((suggestion,i)=>
          <div
            className="suggestion list-group-item bg-dark"
            key={i}
            onClick={()=>onSuggestHandler(suggestion.login)}
          >
            {suggestion.login}
          </div>
        )}
      </div>
    </>
  );
}

class App extends React.Component {
  state = {
    profiles: [],
  };
  addNewProfile = (profileData) => {
  	this.setState(prevState => ({
    	profiles: [...prevState.profiles, profileData],
    }));
  };
	render() {
  	return (
    	<div>
    	  <div className="header">{this.props.title}</div>
        <Form onSubmit={this.addNewProfile} />
        <CardList profiles={this.state.profiles} />
    	</div>
    );
  }
}

export default App;

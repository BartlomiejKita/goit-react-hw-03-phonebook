import { Component } from 'react';
import { nanoid } from 'nanoid';
import ContactForm from './ContactForm';
import Filter from './Filter';
import ContactList from './ContactList';
import Notification from './Notification';
import styled from 'styled-components';
import { save, load } from '../utilities/json';
import isEmpty from 'utilities/isEmpty';

const Center = styled.div`
  position: relative;
  padding: 50px 50px;
  background: #fff;
  border-radius: 10px;
`;

const MainHeader = styled.h1`
  font-size: 2em;
  border-left: 5px solid dodgerblue;
  padding: 10px;
  color: #000;
  letter-spacing: 5px;
  margin-bottom: 60px;
  font-weight: bold;
  padding-left: 10px;
`;

const SecondHeader = styled.h2`
  font-size: 1.5em;
  border-left: 5px solid dodgerblue;
  padding: 10px;
  color: #000;
  letter-spacing: 5px;
  margin-bottom: 60px;
  font-weight: bold;
  padding-left: 10px;
`;

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const contacts = load('contacts');
    if (contacts) {
      this.setState({ contacts: contacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const nextContacts = this.state.contacts;
    const prevContacts = prevState.contacts;
    if (nextContacts !== prevContacts) {
      save('contacts', nextContacts);
    }
  }

  getContacts = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLocaleLowerCase();
    return contacts
      .filter(contact => contact.name.toLowerCase().includes(normalizedFilter))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  addContact = ({ name, number }) => {
    const contact = { id: nanoid(), name, number };
    this.setState(({ contacts }) => ({ contacts: [contact, ...contacts] }));
  };

  handleFilter = evt => {
    const { value } = evt.target;
    this.setState({ filter: value });
  };

  deleteContact = id => {
    this.setState(state => ({
      contacts: state.contacts.filter(contact => contact.id !== id),
    }));
  };

  render() {
    return (
      <>
        <Center>
          <MainHeader>Phonebook</MainHeader>
          <ContactForm addContact={this.addContact} state={this.state} />

          <SecondHeader>Contacts</SecondHeader>
          <Filter onChange={this.handleFilter} />
          {isEmpty(this.state.contacts) ? (
            <Notification message="There is no contacts to show" />
          ) : (
            <ContactList
              getContacts={this.getContacts}
              deleteContact={this.deleteContact}
            />
          )}
        </Center>
      </>
    );
  }
}

export default App;

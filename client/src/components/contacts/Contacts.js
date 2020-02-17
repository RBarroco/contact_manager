import React, { Fragment, useContext, useEffect } from 'react';
import Spinner from '../layout/Spinner';
import ContactItem from './ContactItem';
import ContactContext from '../../context/contact/contactContext';

const Contacts = () => {
  const contactContext = useContext(ContactContext);

  const { contacts, filtered, getContacts, loading } = contactContext;

  useEffect(() => {
    getContacts();
    // eslint-disable-next-line
  }, []);

  if (contacts !== null && contacts.length === 0 && !loading) {
    return <h4>Please add a contact</h4>;
  }

  return (
    <Fragment>
      {contacts !== null && !loading ? (
        <div>
          {/*If we have anything inside of filtered we show it else we show everything*/}
          {filtered !== null
            ? filtered.map(contact => (
                <ContactItem contact={contact} key={contact._id} />
              ))
            : contacts.map(contact => (
                <ContactItem contact={contact} key={contact._id} />
              ))}
        </div>
      ) : (
        <Spinner />
      )}
    </Fragment>
  );
};

export default Contacts;

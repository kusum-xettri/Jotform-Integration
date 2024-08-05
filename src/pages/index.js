import { useQuery, gql } from '@apollo/client';
import client from '../pages/lib/apolloClient';
import { useState } from 'react';

const GET_SUBMISSIONS = gql`
  query GetSubmissions {
    submissions {
      id
      formId
      submissionId
      data
    }
  }
`;

const formatData = (data) => {
  return JSON.stringify(data, null, 2);
};

export default function Home() {
  const { loading, error, data } = useQuery(GET_SUBMISSIONS,{client});

  // Generate pre-filled URL based on selected submission
  const generatePrefillUrl = (submission) => {
    if (!submission) return '';
    const formId = '242049171984058';
    const formUrl = `https://form.jotform.com/${formId}`;
    const { name, email, address } = submission;
    console.log("vgh",submission)
    return `${formUrl}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&address=${encodeURIComponent(address)}`;
  };

  const handleOpenForm = (submission) => {
    const prefillUrl = generatePrefillUrl(submission);
    window.open(prefillUrl, '_blank');
  };

  const [prefillData, setPrefillData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    address: "abc",
  });
  const formId = "242049171984058";
  const formUrl = `https://form.jotform.com/${formId}`;
  const prefillUrl = `${formUrl}?name=${encodeURIComponent(prefillData.name)}&email=${encodeURIComponent(prefillData.email)}&address=${encodeURIComponent(prefillData.address)}`;

  const sendToJotForm = async () => {
    try {
      const response = await fetch('/api/sendToJotForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formId: '242049171984058',
          answers: {
            name: 'Ksss Doe',
            email: 'ks.doe@example.com',
            address: 30,
          }
        })
      });
      const result = await response.json();
      console.log('Submission result:', result);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error sending to JotForm:', error);
      alert('There was an error submitting the form. Please try again.');
    }
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;



  return (
    <div>

{/* <a href={prefillUrl} target="_blank" rel="noopener noreferrer">
        Fill out the form with prefilled data
      </a> */}
      <div className='mt-4'>
        <a href={prefillUrl} target="_blank" rel="noopener noreferrer">
        Fill out the form with prefilled data
      </a>
      </div>
      <div className='mt-6'>
      <button onClick={sendToJotForm}>Submit Data to JotForm</button>
      </div>
      <div>
      <button className='mt-6 mb-6' onClick={() => handleOpenForm(prefillData)}>
                  Open Form with Data
                </button>
                </div>
      <h1>JotForm Submissions</h1>


      <table>
        <thead>
          <tr>
            <th>Form ID</th>
            <th>Submission ID</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {data.submissions.map((submission) => (
            <tr key={submission.id}>
              <td>{submission.formId}</td>
              <td>{submission.submissionId}</td>
              <td>
                <pre>{formatData(submission.data)}</pre>
              </td>
              <td>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// const generatePrefillUrl = (submission) => {
//   if (!submission) return '';
//   const formId = '242049171984058';
//   const formUrl = `https://form.jotform.com/${formId}`;
//   const { q4_name, q5_email, q6_address } = submission;
//   console.log("submi",submission)

//   return `${formUrl}?q4_name[first]=${encodeURIComponent(q4_name.first)}&q4_name[last]=${encodeURIComponent(q4_name.last)}&q5_email=${encodeURIComponent(q5_email)}&q6_address[addr_line1]=${encodeURIComponent(q6_address.addr_line1)}&q6_address[addr_line2]=${encodeURIComponent(q6_address.addr_line2)}&q6_address[city]=${encodeURIComponent(q6_address.city)}&q6_address[state]=${encodeURIComponent(q6_address.state)}&q6_address[postal]=${encodeURIComponent(q6_address.postal)}`;
// };

// const handleOpenForm = (submission) => {
//   const prefillUrl = generatePrefillUrl(submission);
//   window.open(prefillUrl, '_blank');
// };

// const prefillData = {
//   q4_name: {
//     first: "John",
//     last: "Doe"
//   },
//   q5_email: "john.doe@example.com",
//   q6_address: {
//     addr_line1: "123 Main St",
//     addr_line2: "Apt 4B",
//     city: "Metropolis",
//     state: "NY",
//     postal: "12345"
//   }
// };
import { useQuery, gql } from '@apollo/client';
import client from '../pages/lib/apolloClient';

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

export default function Home() {
  const { loading, error, data } = useQuery(GET_SUBMISSIONS,{client});
  console.log("data",data)

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
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
                <pre>{JSON.stringify(submission.data, null, 2)}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

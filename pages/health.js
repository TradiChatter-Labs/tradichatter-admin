export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify({ status: 'ok', service: 'tradichatter-admin', version: '1.0.0' }));
  res.end();
  return { props: {} };
}

export default function Health() {
  return null;
}

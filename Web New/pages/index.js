import Head from "next/head";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAllDomainInfos } from "../flow/scripts";
import styles from "../styles/Home.module.css";

export default function Home() {
  // Create a state variable for all the DomainInfo structs
  // Initialize it to an empty array
  const [domainInfos, setDomainInfos] = useState([]);
  const [search, setSearch] = useState('');

  // Load all the DomainInfo's by running the Cadence script
  // when the page is loaded
  useEffect(() => {
    async function fetchDomains() {
      const domains = await getAllDomainInfos();
      setDomainInfos(domains);
    }

    fetchDomains();
  }, []);

  const handleChange = (event) => {
    document.getElementById("searchOutputMsg").innerHTML = ""
    setSearch(event.target.value);
    console.log(search)
    console.log(domainInfos)
    domainInfos.map((item) => {
      var domainName = item.name.split('.')
      if (event.target.value === domainName[0]) {
        console.log("Domain name already exists")
        document.getElementById("searchOutputMsg").innerHTML = "Domain name already exists"
      }

      console.log(event.target.value," :: ", domainName[0])
    })

  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Flow Name Service</title>
        <meta name="description" content="Flow Name Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <div className={styles.searchContainer}>
        <h1>Search for a domain</h1>
        <input id="domainSearch" type="text"  onChange={handleChange} />
        <p className={styles.searchOutputMsg} id="searchOutputMsg"></p>
      </div>
      <main className={styles.main}>
        <h1>All Registered Domains</h1>
        <div className={styles.domainsContainer}>
          {
            // If no domains were found, display a message highlighting that
            domainInfos.length === 0 ? (
            <p>No FNS Domains have been registered yet</p>
          ) : (
            // Otherwise, loop over the array, and render information
            // about each domain
            domainInfos.map((di, idx) => (
              <div className={styles.domainInfo} key={idx}>
                <p>
                  {di.id} - {di.name}
                </p>
                <p>Owner: {di.owner}</p>
                <p>Linked Address: {di.address ? di.address : "None"}</p>
                <p>Bio: {di.bio ? di.bio : "None"}</p>
                //Parse the timestamps as human-readable dates
                <p>
                  Created At:{" "}
                  {new Date(parseInt(di.createdAt) * 1000).toLocaleDateString()}
                </p>
                <p>
                  Expires At:{" "}
                  {new Date(parseInt(di.expiresAt) * 1000).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
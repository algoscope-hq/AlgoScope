const IterativeVsRecursive = () => {
  return (
    <section
      style={{
        background: "#111827",
        color: "white",
        padding: "40px",
        margin: "40px auto",
        width: "90%",
        borderRadius: "16px",
      }}
    >
      <h2
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Iterative vs Recursive Algorithms
      </h2>

      <p style={{ marginBottom: "20px", lineHeight: "1.8" }}>
        Iterative algorithms use loops to repeat operations,
        while recursive algorithms solve problems by calling
        themselves repeatedly until a base condition is met.
      </p>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "30px",
        }}
      >
        <thead>
          <tr>
            <th style={tableCell}>Iterative</th>
            <th style={tableCell}>Recursive</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={tableCell}>Uses loops</td>
            <td style={tableCell}>Uses self function calls</td>
          </tr>

          <tr>
            <td style={tableCell}>Less memory usage</td>
            <td style={tableCell}>Uses recursion stack</td>
          </tr>

          <tr>
            <td style={tableCell}>Usually faster</td>
            <td style={tableCell}>
              Elegant for divide-and-conquer problems
            </td>
          </tr>

          <tr>
            <td style={tableCell}>Easy debugging</td>
            <td style={tableCell}>Can be harder to debug</td>
          </tr>
        </tbody>
      </table>

      <h3 style={{ fontSize: "24px", marginBottom: "15px" }}>
        Example: Factorial
      </h3>

      <pre
        style={{
          background: "#1F2937",
          padding: "20px",
          borderRadius: "10px",
          overflowX: "auto",
        }}
      >
{`// Iterative
function factorial(n) {
  let ans = 1;

  for(let i = 1; i <= n; i++) {
    ans *= i;
  }

  return ans;
}

// Recursive
function factorialRecursive(n) {
  if(n === 0) return 1;

  return n * factorialRecursive(n - 1);
}`}
      </pre>
    </section>
  );
};

const tableCell = {
  border: "1px solid white",
  padding: "12px",
};

export default IterativeVsRecursive;
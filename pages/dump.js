export default function DumpPage() {
  const times = Array.from({ length: 1001 }, (_, i) => i);

  return (
    <main>
      <div className="grid" style={{gridTemplateColumns: 'repeat(36, minmax(0, 1fr))'}}>
      {times.map((i) => {
        return (
          <div key={i}>
            <img src={`/dump/${i}.svg`} />
          </div>
        );
      })}
      </div>
      <div className='px-3 py-1'>cranes.supply &mdash; class of '21</div>
    </main>
  );
}


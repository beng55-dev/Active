import React, { useEffect, useState } from 'react';
import './App.css';

const branches = [
  'All branches',
  'Barbaza',
  'Laua-an',
  'Bugasong',
  'Patnongon',
  'Belison',
  'Sibalom',
  'San Remigio',
  'San Jose',
  'Hamtic',
];

const plans = [
  'Cable Basic',
  'Cable Standard',
  'Cable Premium',
  'Fiber 50 Mbps',
  'Fiber 100 Mbps',
  'Fiber 200 Mbps',
  'Home Bundle Plus',
];

const statuses = ['All', 'Pending', 'Approved', 'Scheduled', 'Completed', 'Rejected', 'On hold'];

const accounts = [
  {
    email: 'superadmin@barbazacoop.com',
    password: 'Super@123',
    name: 'Super Admin',
    role: 'Super Admin',
    branch: 'All branches',
  },
  {
    email: 'admin@barbazacoop.com',
    password: 'Admin@123',
    name: 'Juan Dela Cruz',
    role: 'Admin',
    branch: 'All branches',
  },
  {
    email: 'user@barbazacoop.com',
    password: 'User@123',
    name: 'Anna Suarez',
    role: 'Branch User',
    branch: 'Barbaza',
  },
];

const navByRole = {
  'Branch User': [
    ['Dashboard', 'D'],
    ['Activation Requests', 'A'],
    ['Customers', 'C'],
  ],
  Admin: [
    ['Dashboard', 'D'],
    ['Activation Requests', 'A'],
    ['Customers', 'C'],
    ['Reports', 'R'],
    ['Settings', 'S'],
  ],
  'Super Admin': [
    ['Dashboard', 'D'],
    ['Activation Requests', 'A'],
    ['Customers', 'C'],
    ['Linemans', 'L'],
    ['Service Plans', 'P'],
    ['Reports', 'R'],
    ['Settings', 'S'],
  ],
};

const seedRequests = [
  {
    id: 'ACT-001',
    date: '2026-07-22',
    name: 'Maria Reyes',
    address: 'Barbaza Branch Service Area, Antique',
    branch: 'Barbaza',
    package: 'Fiber 100 Mbps',
    status: 'Pending',
    remarks: 'Pending approval from admin and super admin',
    history: ['Request submitted by branch user.'],
  },
  {
    id: 'ACT-002',
    date: '2026-07-22',
    name: 'Juan dela Cruz',
    address: 'Laua-an Branch Service Area, Antique',
    branch: 'Laua-an',
    package: 'Cable Premium',
    status: 'Scheduled',
    remarks: 'Installation scheduled by admin',
    schedule: '2026-07-30',
    history: ['Request submitted.', 'Approved by admin.', 'Installation scheduled.'],
  },
  {
    id: 'ACT-003',
    date: '2026-07-21',
    name: 'Ana Santos',
    address: 'Bugasong Branch Service Area, Antique',
    branch: 'Bugasong',
    package: 'Fiber 50 Mbps',
    status: 'Approved',
    remarks: 'Approved by admin',
    history: ['Request submitted.', 'Approved by admin.'],
  },
];

const seedCustomers = [
  {
    id: 'CUS-001',
    date: '2026-07-22',
    box: '1001',
    name: 'Maria Reyes',
    address: 'Barbaza Branch Service Area, Antique',
    branch: 'Barbaza',
    package: 'Fiber 100 Mbps',
    status: 'Pending',
    requestId: 'ACT-001',
  },
  {
    id: 'CUS-002',
    date: '2026-07-22',
    box: '1002',
    name: 'Juan dela Cruz',
    address: 'Laua-an Branch Service Area, Antique',
    branch: 'Laua-an',
    package: 'Cable Premium',
    status: 'Scheduled',
    requestId: 'ACT-002',
  },
  {
    id: 'CUS-003',
    date: '2026-07-21',
    box: '1003',
    name: 'Ana Santos',
    address: 'Bugasong Branch Service Area, Antique',
    branch: 'Bugasong',
    package: 'Fiber 50 Mbps',
    status: 'Approved',
    requestId: 'ACT-003',
  },
];

function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [account, setAccount] = useState(accounts[0]);
  const [page, setPage] = useState('Dashboard');
  const [modal, setModal] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [requestFilter, setRequestFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All branches');
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState(() => readStorage('barbaza_theme', 'light'));
  const [requests, setRequests] = useState(() =>
    normalizeRequests(readStorage('barbaza_requests', seedRequests)),
  );
  const [customers, setCustomers] = useState(() =>
    readStorage('barbaza_customers', seedCustomers),
  );
  const [users, setUsers] = useState(() =>
    readStorage('barbaza_users', [
      { name: 'Anna Suarez', position: 'Branch User', branch: 'Barbaza' },
      { name: 'Marco Reyes', position: 'Branch User', branch: 'Laua-an' },
      { name: 'Elena Santos', position: 'Admin', branch: 'All branches' },
    ]),
  );

  useEffect(() => writeStorage('barbaza_requests', requests), [requests]);
  useEffect(() => writeStorage('barbaza_customers', customers), [customers]);
  useEffect(() => writeStorage('barbaza_users', users), [users]);
  useEffect(() => writeStorage('barbaza_theme', theme), [theme]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
  }, [theme]);

  const nav = navByRole[account.role] || navByRole.Admin;
  const visibleRequests = requests.filter(
    (request) => account.role !== 'Branch User' || request.branch === account.branch,
  );
  const visibleCustomers = customers.filter(
    (customer) => account.role !== 'Branch User' || customer.branch === account.branch,
  );
  const visibleBranches = account.role === 'Branch User' ? [account.branch] : branches.slice(1);
  const selectedName = selectedCustomer?.name || '';

  const goRequests = (filter) => {
    setRequestFilter(filter);
    setSelectedCustomer(null);
    setPage('Activation Requests');
  };

  const syncCustomerStatus = (requestId, status) => {
    setCustomers((current) =>
      current.map((customer) =>
        customer.requestId === requestId ? { ...customer, status } : customer,
      ),
    );
  };

  const saveCustomer = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const branch = account.role === 'Branch User' ? account.branch : String(form.get('branch'));
    const name = String(form.get('name') || '').trim();
    const requestId = `ACT-${String(requests.length + 1).padStart(3, '0')}`;
    const customerId = `CUS-${String(customers.length + 1).padStart(3, '0')}`;
    const plan = String(form.get('package') || plans[0]);

    const request = {
      id: requestId,
      date: today(),
      name,
      address: branchAddress(branch),
      branch,
      package: plan,
      status: 'Pending',
      remarks: 'Pending approval from admin and super admin',
      history: [
        `Added by ${account.name} (${account.role}).`,
        'Customer request created as Pending.',
      ],
    };

    const customer = {
      id: customerId,
      date: today(),
      box: String(1001 + customers.length).padStart(4, '0'),
      name,
      address: branchAddress(branch),
      branch,
      package: plan,
      status: 'Pending',
      requestId,
    };

    setCustomers((current) => [customer, ...current]);
    setRequests((current) => [request, ...current]);
    setModal('');
    setSelectedCustomer(customer);
    setRequestFilter('All');
    setPage('Activation Requests');
  };

  const saveUser = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setUsers((current) => [
      ...current,
      {
        name: String(form.get('name') || ''),
        position: String(form.get('position') || 'Branch User'),
        branch: String(form.get('branch') || 'All branches'),
      },
    ]);
    setModal('');
  };

  const viewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setRequestFilter('All');
    setPage('Activation Requests');
  };

  const toggleTheme = () => setTheme((current) => (current === 'light' ? 'dark' : 'light'));

  if (!loggedIn) {
    return (
      <LoginScreen
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogin={(nextAccount) => {
          setAccount(nextAccount);
          setPage('Dashboard');
          setLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className={`app-shell theme-${theme}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <img src="/barbaza-coop-logo.jfif" alt="Barbaza Cooperative logo" />
          </div>
          <div>
            <b>BARBAZA COOPERATIVE</b>
            <span>{account.role} workspace</span>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {nav.map(([name, initial]) => (
            <button
              key={name}
              className={`nav-item ${page === name ? 'active' : ''}`}
              onClick={() => {
                setPage(name);
                setSelectedCustomer(null);
              }}
            >
              <i>{initial}</i>
              <span>{name}</span>
              {name === 'Activation Requests' && (
                <b className="nav-count">
                  {visibleRequests.filter((request) => request.status === 'Pending').length}
                </b>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="workspace-card">
            <strong>{account.name}</strong>
            <span>{account.branch}</span>
            <small>Signed in as {account.role}</small>
          </div>
          <button className="logout-btn" onClick={() => setLoggedIn(false)}>
            Log Out
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="topbar-meta">
            <span>{today()}</span>
            <strong>{account.name}</strong>
          </div>
          <div className="top-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <span className="role-chip">{account.role}</span>
          </div>
        </div>

        <div className="content">
          <div className="page-heading">
            <div>
              <small>
                {today()} / {account.branch}
              </small>
              <h1>{page}</h1>
              <p>{headingCopy(page, account)}</p>
            </div>
          </div>

          {page === 'Dashboard' && (
            <Dashboard
              requests={visibleRequests}
              customers={visibleCustomers}
              allBranches={account.role !== 'Branch User'}
              openStatus={goRequests}
            />
          )}

          {page === 'Activation Requests' && (
            <Requests
              rows={visibleRequests}
              setRows={setRequests}
              syncCustomerStatus={syncCustomerStatus}
              role={account.role}
              actor={account.name}
              filter={requestFilter}
              setFilter={setRequestFilter}
              selectedName={selectedName}
              clearSelected={() => setSelectedCustomer(null)}
            />
          )}

          {page === 'Customers' && (
            <Customers
              data={visibleCustomers}
              canAdd={account.role === 'Branch User'}
              onAdd={() => setModal('customer')}
              view={viewCustomer}
              role={account.role}
            />
          )}

          {page === 'Linemans' && <Linemans branch={branchFilter} setBranch={setBranchFilter} />}

          {page === 'Service Plans' && <Plans />}

          {page === 'Reports' && (
            <Reports requests={requests} customers={customers} query={query} setQuery={setQuery} />
          )}

          {page === 'Settings' && (
            <Settings users={users} setUsers={setUsers} add={() => setModal('user')} />
          )}
        </div>

        {modal === 'customer' && (
          <CustomerModal
            account={account}
            branches={visibleBranches}
            box={String(1001 + customers.length).padStart(4, '0')}
            save={saveCustomer}
            close={() => setModal('')}
          />
        )}

        {modal === 'user' && <UserModal save={saveUser} close={() => setModal('')} />}
      </main>
    </div>
  );
}

function Dashboard({ requests, customers, allBranches, openStatus }) {
  const counts = statusCounts(requests);
  const covered = new Set([...requests, ...customers].map((item) => item.branch)).size;

  return (
    <>
      <div className="stat-grid">
        <Stat tone="teal" label="Total customers" value={customers.length} />
        <Stat tone="amber" label="Pending requests" value={counts.Pending} />
        <Stat tone="blue" label="Approved requests" value={counts.Approved} />
        <Stat
          tone="slate"
          label={allBranches ? 'Branches reporting' : 'Completed'}
          value={allBranches ? covered : counts.Completed}
        />
      </div>

      <div className="overview-grid">
        <section className="panel">
          <Title t="Activation overview" s="Live branch totals from activation records" />
          <BranchBars requests={requests} />
        </section>

        <section className="panel status-panel">
          <Title t="Request status" s="Open a status queue to review work" />
          <div className="machine-status">
            <button onClick={() => openStatus('Pending')}>
              <b>{counts.Pending}</b>
              <span>Pending</span>
            </button>
            <button onClick={() => openStatus('Approved')}>
              <b>{counts.Approved}</b>
              <span>Approved</span>
            </button>
            <button onClick={() => openStatus('Scheduled')}>
              <b>{counts.Scheduled}</b>
              <span>Scheduled</span>
            </button>
            <button onClick={() => openStatus('Completed')}>
              <b>{counts.Completed}</b>
              <span>Completed</span>
            </button>
          </div>
          <div className="system-ready">
            <strong>{requests.length}</strong>
            <span>Total active request records</span>
          </div>
        </section>
      </div>
    </>
  );
}

function Requests({
  rows,
  setRows,
  syncCustomerStatus,
  role,
  actor,
  filter,
  setFilter,
  selectedName,
  clearSelected,
}) {
  const list = rows
    .filter((request) => filter === 'All' || request.status === filter)
    .filter((request) => !selectedName || request.name === selectedName);
  const counts = statusCounts(rows);
  const canApprove = role === 'Admin' || role === 'Super Admin';

  const update = (id, status, remark) => {
    setRows((current) =>
      current.map((request) =>
        request.id === id
          ? {
              ...request,
              status,
              remarks: remark || defaultRemark(status),
              schedule: status === 'Scheduled' ? request.schedule || today() : request.schedule,
              history: [
                ...(request.history || []),
                `${actor} changed request to ${status} on ${today()}.`,
              ],
            }
          : request,
      ),
    );
    syncCustomerStatus(requestIdFromRow(rows, id), status);
  };

  return (
    <section className="panel requests-page">
      <div className="section-title">
        <Title
          t={selectedName ? `${selectedName} activation status` : 'Activation request queue'}
          s="Review pending work, update status, and track approvals"
        />
        {selectedName && (
          <button className="secondary-btn" onClick={clearSelected}>
            Show all
          </button>
        )}
      </div>

      <div className="request-summary">
        {['Pending', 'Approved', 'Scheduled', 'Completed', 'Rejected'].map((status) => (
          <button
            key={status}
            className={filter === status ? 'active' : ''}
            onClick={() => setFilter(status)}
          >
            <b>{counts[status]}</b>
            <span>{status}</span>
          </button>
        ))}
        <button className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>
          <b>{rows.length}</b>
          <span>All</span>
        </button>
      </div>

      <div className="request-toolbar">
        <label className="branch-filter">
          Filter
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
      </div>

      <ActivationTable rows={list} canApprove={canApprove} update={update} />
    </section>
  );
}

function ActivationTable({ rows, canApprove, update }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Date Requested</th>
            <th>Client Name</th>
            <th>Address</th>
            <th>Branch</th>
            <th>Package</th>
            <th>Status</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`client-row ${statusClass(row.status)}`}>
              <td>{row.date}</td>
              <td>
                <b>{row.name}</b>
                <small className="row-history">{(row.history || []).join(' ')}</small>
              </td>
              <td>{row.address}</td>
              <td>{row.branch}</td>
              <td>{row.package}</td>
              <td>
                <span className={`status-pill ${statusClass(row.status)}`}>{row.status}</span>
                {row.schedule && <small className="row-history">Schedule: {row.schedule}</small>}
              </td>
              <td>{row.remarks}</td>
              <td>
                {canApprove ? (
                  <div className="request-actions">
                    <button onClick={() => update(row.id, 'Approved', 'Approved by admin')}>
                      Approve
                    </button>
                    <button
                      onClick={() => update(row.id, 'Scheduled', 'Installation scheduled by admin')}
                    >
                      Schedule
                    </button>
                    <button onClick={() => update(row.id, 'Completed', 'Activation completed')}>
                      Complete
                    </button>
                    <button onClick={() => update(row.id, 'Rejected', 'Rejected by admin')}>
                      Reject
                    </button>
                    <select value={row.status} onChange={(event) => update(row.id, event.target.value)}>
                      {statuses
                        .filter((status) => status !== 'All')
                        .map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                    </select>
                  </div>
                ) : (
                  <span className="branch-note">Waiting for admin approval</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Customers({ data, canAdd, onAdd, view, role }) {
  return (
    <section className="panel customers-page">
      <div className="section-title">
        <Title
          t="Customer workspace"
          s={
            canAdd
              ? 'Branch users submit customer requests that start as Pending'
              : 'Customer records are read-only for review and approval'
          }
        />
        {canAdd ? (
          <button className="primary-btn" onClick={onAdd}>
            New customer request
          </button>
        ) : (
          <div className="workspace-note">
            Customer additions are submitted by branch users, then approved by {role}.
          </div>
        )}
      </div>

      {data.length ? (
        <CustomerTable rows={data} view={view} />
      ) : (
        <div className="customer-empty">
          <h3>No customer records yet</h3>
          <p>
            {canAdd
              ? 'Create a customer request to place it in Pending approval.'
              : 'Branch users will submit customer requests here for approval.'}
          </p>
        </div>
      )}
    </section>
  );
}

function CustomerTable({ rows, view }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Date Added</th>
            <th>Client Name</th>
            <th>Address</th>
            <th>Branch</th>
            <th>Box</th>
            <th>Package</th>
            <th>Status</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.date}</td>
              <td>
                <button className="name-link" onClick={() => view(row)}>
                  {row.name}
                </button>
              </td>
              <td>{row.address}</td>
              <td>{row.branch}</td>
              <td>{row.box}</td>
              <td>{row.package}</td>
              <td>
                <span className={`status-pill ${statusClass(row.status)}`}>{row.status || 'Pending'}</span>
              </td>
              <td>
                <button className="secondary-btn" onClick={() => view(row)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CustomerModal({ account, branches, box, save, close }) {
  const [branch, setBranch] = useState(account.role === 'Branch User' ? account.branch : branches[0]);

  useEffect(() => {
    setBranch(account.role === 'Branch User' ? account.branch : branches[0]);
  }, [account.role, account.branch, branches]);

  const address = branchAddress(branch);

  return (
    <Modal title="New customer request" save={save} close={close}>
      <label>
        Date
        <input value={today()} readOnly />
      </label>
      <label>
        Box Number
        <input value={box} readOnly />
      </label>
      <label className="wide">
        Complete Name
        <input name="name" required />
      </label>
      <label className="wide">
        Branch
        <select
          name="branch"
          value={branch}
          onChange={(event) => setBranch(event.target.value)}
          disabled={account.role === 'Branch User'}
        >
          {branches.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="wide">
        Auto Address
        <input name="address" value={address} readOnly />
      </label>
      <label className="wide">
        Package
        <select name="package" defaultValue={plans[0]}>
          {plans.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
    </Modal>
  );
}

function Settings({ users, setUsers, add }) {
  const [selected, setSelected] = useState('Branch Users');

  return (
    <section className="settings-layout">
      <div className="settings-nav">
        {['Branch Users', 'Audit Logs'].map((item) => (
          <button
            className={selected === item ? 'active' : ''}
            onClick={() => setSelected(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="panel settings-content">
        {selected === 'Branch Users' ? (
          <>
            <div className="settings-heading">
              <div>
                <h2>Branch Users</h2>
                <p>Manage branch user accounts only.</p>
              </div>
              <button className="primary-btn" onClick={add}>
                Add user
              </button>
            </div>

            {users.map((user, index) => (
              <div className="setting-row" key={`${user.name}-${index}`}>
                <div>
                  <b>{user.branch}</b>
                  <span>
                    {user.name} - {user.position}
                  </span>
                </div>
                <UserEditor
                  user={user}
                  save={(next) => setUsers((current) => current.map((item, i) => (i === index ? next : item)))}
                />
              </div>
            ))}
          </>
        ) : (
          <AuditLogs />
        )}
      </div>
    </section>
  );
}

function UserModal({ save, close }) {
  return (
    <Modal title="Add branch user" save={save} close={close}>
      <label className="wide">
        Complete Name
        <input name="name" required />
      </label>
      <label>
        Position
        <select name="position" defaultValue="Branch User">
          <option>Branch User</option>
          <option>Admin</option>
        </select>
      </label>
      <label className="wide">
        Branch
        <select name="branch" defaultValue={branches[1]} required>
          {branches.slice(1).map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
    </Modal>
  );
}

function UserEditor({ user, save }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [position, setPosition] = useState(user.position);
  const [branch, setBranch] = useState(user.branch);

  const submit = (event) => {
    event.preventDefault();
    save({ name, position, branch });
    setEditing(false);
  };

  if (!editing) {
    return (
      <button className="secondary-btn" onClick={() => setEditing(true)}>
        Edit
      </button>
    );
  }

  return (
    <form className="user-edit-form" onSubmit={submit}>
      <input value={name} onChange={(event) => setName(event.target.value)} required />
      <select value={position} onChange={(event) => setPosition(event.target.value)}>
        <option>Branch User</option>
        <option>Admin</option>
      </select>
      <select value={branch} onChange={(event) => setBranch(event.target.value)}>
        {branches.slice(1).map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <button className="primary-btn">Save</button>
      <button type="button" className="secondary-btn" onClick={() => setEditing(false)}>
        Cancel
      </button>
    </form>
  );
}

function Linemans({ branch, setBranch }) {
  const names = [
    'Pedro Garcia',
    'Marco Reyes',
    'Ramon Santos',
    'Leo Cruz',
    'Nestor Cruz',
    'Rico Santos',
    'Joel Garcia',
    'Carlo Reyes',
    'Ben Dela Cruz',
  ];

  const rows = branches
    .slice(1)
    .map((item, index) => ({
      id: `LM-${String(index + 1).padStart(3, '0')}`,
      name: names[index],
      branch: item,
      status: index === 2 ? 'On leave' : 'Active',
    }))
    .filter((item) => branch === 'All branches' || item.branch === branch);

  return (
    <section className="panel">
      <div className="section-title">
        <Title t="Lineman roster" s="Super admin branch coverage report" />
        <label className="branch-filter">
          Branch
          <select value={branch} onChange={(event) => setBranch(event.target.value)}>
            {branches.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <SimpleTable rows={rows} />
    </section>
  );
}

function Plans() {
  return (
    <section className="panel plans-page">
      <Title t="Service plans" s="Cable, internet, and bundle activation plans" />
      <div className="plan-grid">
        {plans.map((item) => (
          <article className="plan-card" key={item}>
            <span className="plan-badge">Available</span>
            <h3>{item}</h3>
            <strong>{item.includes('Fiber') ? 'Internet' : item.includes('Bundle') ? 'Bundle' : 'Cable'}</strong>
            <p>Clear service plan details for branch-assisted activation requests.</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Reports({ requests, customers, query, setQuery }) {
  const rows = [
    ...requests.map((item) => ({ type: 'Activation', ...item })),
    ...customers.map((item) => ({
      type: 'Customer',
      status: item.status,
      remarks: 'Customer record',
      ...item,
    })),
  ].filter((item) => Object.values(item).join(' ').toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="panel reports-page">
      <Title t="Branchwide reports" s="Search activation and customer records" />
      <div className="report-filter">
        <b>Search</b>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, branch, package, status..."
        />
        <button onClick={() => setQuery('')}>Clear</button>
      </div>
      <SimpleTable
        rows={rows.map((item) => ({
          type: item.type,
          date: item.date,
          name: item.name,
          branch: item.branch,
          package: item.package,
          status: item.status,
        }))}
      />
    </section>
  );
}

function SimpleTable({ rows }) {
  const keys = rows[0] ? Object.keys(rows[0]) : [];

  return rows.length ? (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {keys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {keys.map((key) => (
                <td key={key}>{row[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="customer-empty">
      <h3>No records found</h3>
    </div>
  );
}

function BranchBars({ requests }) {
  const counts = branches.slice(1).map((branch) => ({
    branch,
    count: requests.filter((request) => request.branch === branch).length,
  }));
  const max = Math.max(1, ...counts.map((item) => item.count));

  return (
    <div className="branch-bars-live">
      {counts.map((item) => (
        <div key={item.branch} className="branch-bar-row">
          <span>{item.branch}</span>
          <div>
            <b style={{ width: `${Math.max(4, (item.count / max) * 100)}%` }} />
          </div>
          <em>{item.count}</em>
        </div>
      ))}
    </div>
  );
}

function Modal({ title, save, close, children }) {
  return (
    <div className="modal-backdrop">
      <form className="customer-form" onSubmit={save}>
        <div className="modal-head">
          <div>
            <h2>{title}</h2>
            <p>Complete the request and keep the workflow consistent.</p>
          </div>
          <button type="button" onClick={close}>
            x
          </button>
        </div>

        <div className="form-grid">{children}</div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={close}>
            Cancel
          </button>
          <button className="primary-btn">Save</button>
        </div>
      </form>
    </div>
  );
}

function LoginScreen({ onLogin, theme, onToggleTheme }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const found = accounts.find((item) => item.email === email && item.password === password);
    if (found) {
      onLogin(found);
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className={`login-screen theme-${theme}`}>
      <div className="login-card">
        <div className="login-head">
          <img src="/barbaza-coop-logo.jfif" alt="Barbaza Cooperative" />
          <button className="theme-toggle" onClick={onToggleTheme}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
        <h1>BARBAZA COOPERATIVE</h1>
        <p>Cable and Internet Activation</p>
        <form onSubmit={submit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="superadmin@barbazacoop.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Super@123"
              required
            />
          </label>
          {error && <p className="login-error">{error}</p>}
          <button className="primary-btn">Log In</button>
        </form>
      </div>
    </div>
  );
}

function AuditLogs() {
  const logs = [
    ['2026-07-22 09:42', 'Super Admin', 'View', 'Viewed all branch reports', 'Viewed'],
    ['2026-07-22 09:35', 'Admin', 'Update', 'Approved activation request', 'Updated'],
    ['2026-07-22 09:18', 'Branch User', 'Create', 'Created auto-pending activation request', 'Created'],
  ];

  return (
    <>
      <h2>Audit Logs</h2>
      <p>Branch user and approval activity only.</p>
      <div className="audit-list">
        {logs.map((log, index) => (
          <div className="audit-item" key={index}>
            <div className="audit-time">{log[0]}</div>
            <div className="audit-main">
              <b>{log[2]}</b>
              <span>{log[3]}</span>
              <small>Performed by {log[1]}</small>
            </div>
            <em className={`audit-status ${log[4].toLowerCase()}`}>{log[4]}</em>
          </div>
        ))}
      </div>
    </>
  );
}

function Title({ t, s }) {
  return (
    <div className="title-block">
      <h2>{t}</h2>
      <p>{s}</p>
    </div>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <span className="stat-kicker">{label}</span>
      <strong>{value}</strong>
      <small>Updated from current records</small>
    </div>
  );
}

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write failures in restricted environments.
  }
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function branchAddress(branch) {
  return `${branch} Branch Service Area, Antique`;
}

function headingCopy(page, account) {
  if (page === 'Dashboard') {
    return account.role === 'Super Admin'
      ? 'All Barbaza Cooperative branch reports and requests.'
      : 'Workspace summary for your assigned records.';
  }

  if (page === 'Activation Requests') {
    return account.role === 'Branch User'
      ? 'Requests submitted by branch users stay Pending until reviewed.'
      : 'Review request details, remarks, and approval status.';
  }

  if (page === 'Customers') {
    return 'Customer records are created by branch users and approved by admins.';
  }

  if (page === 'Reports') {
    return 'Review customer and activation activity across branches.';
  }

  return 'Professional operations workspace for daily branch work.';
}

function statusClass(value) {
  const status = String(value || '').toLowerCase();
  if (status === 'approved') return 'approved';
  if (status === 'pending') return 'pending';
  if (status === 'rejected') return 'rejected';
  if (status === 'completed') return 'completed';
  if (status === 'scheduled') return 'scheduled';
  return 'default-status';
}

function statusCounts(rows) {
  return statuses
    .filter((status) => status !== 'All')
    .reduce((acc, status) => {
      acc[status] = rows.filter((row) => row.status === status).length;
      return acc;
    }, {});
}

function defaultRemark(status) {
  if (status === 'Approved') return 'Approved by admin';
  if (status === 'Scheduled') return 'Installation scheduled by admin';
  if (status === 'Completed') return 'Activation completed';
  if (status === 'Rejected') return 'Rejected by admin';
  if (status === 'On hold') return 'Request placed on hold';
  return 'Pending approval from admin';
}

function normalizeRequests(rows) {
  return rows.map((row, index) =>
    Array.isArray(row)
      ? {
          id: row[0] || `ACT-${String(index + 1).padStart(3, '0')}`,
          date: today(),
          name: row[1],
          address: row[2],
          branch: row[2],
          package: row[3],
          status: row[4] || 'Pending',
          remarks: defaultRemark(row[4] || 'Pending'),
          history: ['Imported request record.'],
        }
      : row,
  );
}

function requestIdFromRow(rows, id) {
  const match = rows.find((row) => row.id === id);
  return match?.requestId || id;
}

export default App;

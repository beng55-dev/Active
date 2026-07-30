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

const barbazaBarangays = [
  'Baghari',
  'Bahuyan',
  'Beri',
  'Biga-a',
  'Binangbang',
  'Binangbang Centro',
  'Binanu-an',
  'Cadiao',
  'Calapadan',
  'Capoyuan',
  'Cubay',
  'Embrangga-an',
  'Esparar',
  'Gua',
  'Idao',
  'Igpalge',
  'Igtunarum',
  'Integasan',
  'Ipil',
  'Jinalinan',
  'Lanas',
  'Langcaon (Evelio Javier)',
  'Lisub',
  'Lombuyan',
  'Mablad',
  'Magtulis',
];

const seedCustomers = [
  {
    id: 'CUS-SEED-001',
    requestId: 'ACT-SEED-001',
    date: '2026-07-30',
    box: '001',
    name: 'Caleb Lovega',
    barangay: 'Baghari',
    address: branchAddress('Barbaza', 'Baghari'),
    branch: 'Barbaza',
    package: 'Cable Premium',
    status: 'Pending',
    remarks: 'Pending approval from admin and super admin',
    history: ['Added by Anna Suarez (Branch User). Customer request created as Pending.'],
  },
  {
    id: 'CUS-SEED-002',
    requestId: 'ACT-SEED-002',
    date: '2026-07-30',
    box: '002',
    name: 'Jesally Tiad',
    barangay: 'Bahuyan',
    address: branchAddress('Barbaza', 'Bahuyan'),
    branch: 'Barbaza',
    package: 'Home Bundle Plus',
    status: 'Approved',
    remarks: 'Approved by admin',
    history: [
      'Added by Anna Suarez (Branch User). Customer request created as Pending.',
      'Super Admin changed request to Approved on 2026-07-30.',
    ],
  },
  {
    id: 'CUS-SEED-003',
    requestId: 'ACT-SEED-003',
    date: '2026-07-30',
    box: '003',
    name: 'Behryl Jean',
    barangay: 'Beri',
    address: branchAddress('Barbaza', 'Beri'),
    branch: 'Barbaza',
    package: 'Fiber 200 Mbps',
    status: 'Approved',
    remarks: 'Approved by admin',
    history: [
      'Added by Juan Dela Cruz (Admin). Activation request created as Pending.',
      'Juan Dela Cruz changed request to Approved on 2026-07-30.',
      'Juan Dela Cruz changed request to Scheduled on 2026-07-30.',
      'Juan Dela Cruz changed request to Approved on 2026-07-30.',
    ],
  },
];

const seedRequests = seedCustomers.map((customer) => ({
  id: customer.requestId,
  date: customer.date,
  box: customer.box,
  name: customer.name,
  address: customer.address,
  branch: customer.branch,
  package: customer.package,
  status: customer.status,
  remarks: customer.remarks,
  requestId: customer.requestId,
  history: customer.history,
}));

function loadSeededRows(storageKey, seedRows) {
  const storedRows = readStorage(storageKey, null);
  if (Array.isArray(storedRows) && storedRows.length) {
    return storedRows;
  }
  return seedRows;
}

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
    ['Dashboard', 'dashboard'],
    ['Activation Requests', 'clipboard-list'],
    ['Customers', 'users'],
  ],
  Admin: [
    ['Dashboard', 'dashboard'],
    ['Activation Requests', 'clipboard-list'],
    ['Customers', 'users'],
    ['Reports', 'chart'],
    ['Settings', 'settings'],
  ],
  'Super Admin': [
    ['Dashboard', 'dashboard'],
    ['Activation Requests', 'clipboard-list'],
    ['Customers', 'users'],
    ['Linemans', 'wrench'],
    ['Service Plans', 'wifi'],
    ['Reports', 'chart'],
    ['Settings', 'settings'],
  ],
};

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
    normalizeRequests(loadSeededRows('barbaza_requests', seedRequests)),
  );
  const [customers, setCustomers] = useState(() =>
    normalizeCustomers(loadSeededRows('barbaza_customers', seedCustomers)),
  );
  const [users, setUsers] = useState(() =>
    readStorage('barbaza_users', [
      { name: 'Anna Suarez', position: 'Branch User', branch: 'Barbaza' },
      { name: 'Marco Reyes', position: 'Branch User', branch: 'Laua-an' },
      { name: 'Elena Santos', position: 'Admin', branch: 'All branches' },
    ]),
  );
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [linemen, setLinemen] = useState(() =>
    readStorage('barbaza_linemen', [
      { id: 'LM-001', name: 'Pedro Garcia', branch: 'Barbaza', status: 'Active' },
      { id: 'LM-002', name: 'Marco Reyes', branch: 'Laua-an', status: 'Active' },
      { id: 'LM-003', name: 'Ramon Santos', branch: 'Bugasong', status: 'Not Active' },
      { id: 'LM-004', name: 'Leo Cruz', branch: 'Patnongon', status: 'Active' },
      { id: 'LM-005', name: 'Nestor Cruz', branch: 'Belison', status: 'Active' },
      { id: 'LM-006', name: 'Rico Santos', branch: 'Sibalom', status: 'Active' },
      { id: 'LM-007', name: 'Joel Garcia', branch: 'San Remigio', status: 'Active' },
      { id: 'LM-008', name: 'Carlo Reyes', branch: 'San Jose', status: 'Active' },
      { id: 'LM-009', name: 'Ben Dela Cruz', branch: 'Hamtic', status: 'Active' },
    ]),
  );

  useEffect(() => writeStorage('barbaza_requests', requests), [requests]);
  useEffect(() => writeStorage('barbaza_customers', customers), [customers]);
  useEffect(() => writeStorage('barbaza_users', users), [users]);
  useEffect(() => writeStorage('barbaza_linemen', linemen), [linemen]);
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
    const customerBox = nextCustomerBox(customers);
    const customerId = `CUS-${String(Number(customerBox)).padStart(3, '0')}`;
    const plan = String(form.get('package') || plans[0]);

    const request = {
      id: requestId,
      date: today(),
      box: customerBox,
      name,
      barangay: String(form.get('barangay') || barbazaBarangays[0]),
      address: branchAddress(branch, String(form.get('barangay') || barbazaBarangays[0])),
      branch,
      package: plan,
      status: 'Pending',
      remarks: String(form.get('remarks') || '').trim(),
      history: [
        `Added by ${account.name} (${account.role}).`,
        'Customer request created as Pending.',
      ],
    };

    const customer = {
      id: customerId,
      date: today(),
      box: customerBox,
      name,
      barangay: String(form.get('barangay') || barbazaBarangays[0]),
      address: branchAddress(branch, String(form.get('barangay') || barbazaBarangays[0])),
      branch,
      package: plan,
      status: 'Pending',
      remarks: String(form.get('remarks') || '').trim(),
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
    const name = String(form.get('name') || '').trim();
    const branch = String(form.get('branch') || 'All branches');
    const email = generateBranchUserEmail(name, branch, users);
    const password = generateBranchUserPassword(name, branch, users);

    setUsers((current) => [
      ...current,
      {
        name,
        position: String(form.get('position') || 'Branch User'),
        branch,
        email,
        password,
      },
    ]);
    setGeneratedCredentials({ name, branch, email, password });
    setModal('user-credentials');
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
          {nav.map(([name, icon]) => (
            <button
              key={name}
              className={`nav-item ${page === name ? 'active' : ''}`}
              onClick={() => {
                setPage(name);
                setSelectedCustomer(null);
              }}
            >
              <Icon name={icon} className="nav-icon" />
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
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="btn-icon" />
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

          {page === 'Linemans' && (
            <Linemans branch={branchFilter} setBranch={setBranchFilter} linemen={linemen} setLinemen={setLinemen} />
          )}

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
            box={nextCustomerBox(customers)}
            save={saveCustomer}
            close={() => setModal('')}
          />
        )}

        {modal === 'user' && <UserModal save={saveUser} close={() => setModal('')} />}
        {modal === 'user-credentials' && generatedCredentials && (
          <CredentialsModal
            credentials={generatedCredentials}
            close={() => {
              setGeneratedCredentials(null);
              setModal('');
            }}
          />
        )}
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
  const list = [...rows]
    .sort((a, b) => Number(a.box || 0) - Number(b.box || 0))
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
            <th>Box Number</th>
            <th>Client Name</th>
            <th>Address</th>
            <th>Branch</th>
            <th>Package</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`client-row ${statusClass(row.status)}`}>
              <td>{row.date}</td>
              <td>{row.box || '-'}</td>
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
                {canApprove ? (
                  <div className="request-actions status-inline-actions">
                    <select value={row.status} onChange={(event) => update(row.id, event.target.value)}>
                      {statuses
                        .filter((status) => status !== 'All')
                        .map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                    </select>
                  </div>
                ) : null}
              </td>
              <td>{row.remarks}</td>
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
            <Icon name="plus" className="btn-icon" />
            New customer request
          </button>
        ) : (
          <div className="workspace-note">
            Customer additions are submitted by branch users, then approved by {role}.
          </div>
        )}
      </div>

      {data.length ? (
        <CustomerTable
          rows={[...data].sort((a, b) => Number(a.box || 0) - Number(b.box || 0))}
          view={view}
        />
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
            <th>No.</th>
            <th>Date Added</th>
            <th>Client Name</th>
            <th>Address</th>
            <th>Branch</th>
            <th>Box</th>
            <th>Package</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td>{String(index + 1).padStart(3, '0')}</td>
              <td>{row.date}</td>
              <td>
                <div className="customer-name-row">
                  <button type="button" className="name-link" onClick={() => view(row)}>
                    {row.name}
                  </button>
                  <button
                    type="button"
                    className="secondary-btn customer-view-btn"
                    onClick={() => view(row)}
                  >
                    View
                  </button>
                </div>
              </td>
              <td>{row.address}</td>
              <td>{row.branch}</td>
              <td>{row.box}</td>
              <td>{row.package}</td>
              <td>
                <span className={`status-pill ${statusClass(row.status)}`}>{row.status || 'Pending'}</span>
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
  const [barangay, setBarangay] = useState(barbazaBarangays[0]);

  useEffect(() => {
    setBranch(account.role === 'Branch User' ? account.branch : branches[0]);
  }, [account.role, account.branch, branches]);

  useEffect(() => {
    setBarangay(barbazaBarangays[0]);
  }, [branch]);

  const address = branchAddress(branch, barangay);

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
        Barangay
        <select name="barangay" value={barangay} onChange={(event) => setBarangay(event.target.value)}>
          {barbazaBarangays.map((item) => (
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
      <label className="wide">
        Customer Remarks / Suggestions
        <textarea
          name="remarks"
          required
          placeholder="Add any remarks, notes, or suggestions for this request"
        />
      </label>
    </Modal>
  );
}

function Settings({ users, setUsers, add }) {
  const [selected, setSelected] = useState('Branch Users');

  return (
    <section className="settings-layout">
      <div className="settings-nav">
        {[
          ['Branch Users', 'users'],
          ['Audit Logs', 'chart'],
        ].map(([item, icon]) => (
          <button
            className={selected === item ? 'active' : ''}
            onClick={() => setSelected(item)}
            key={item}
          >
            <Icon name={icon} className="btn-icon" />
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
                <Icon name="plus" className="btn-icon" />
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

function CredentialsModal({ credentials, close }) {
  const copyCredentials = async () => {
    const text = `Here is the email and password of this branch user.\nEmail: ${credentials.email}\nPassword: ${credentials.password}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard access can be blocked; the credentials remain visible.
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="customer-form credential-modal">
        <div className="modal-head">
          <div>
            <h2>Branch user credentials</h2>
            <p>Here is the email and password of this branch user.</p>
          </div>
          <button type="button" onClick={close}>
            x
          </button>
        </div>

        <div className="credential-card">
          <div className="credential-line">
            <span>Email:</span>
            <strong>{credentials.email}</strong>
          </div>
          <div className="credential-line">
            <span>Password:</span>
            <strong>{credentials.password}</strong>
          </div>
          <div className="credential-line">
            <span>Branch:</span>
            <strong>{credentials.branch}</strong>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={copyCredentials}>
            <Icon name="copy" className="btn-icon" />
            Copy
          </button>
          <button type="button" className="primary-btn" onClick={close}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function UserEditor({ user, save }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [position, setPosition] = useState(user.position);
  const [branch, setBranch] = useState(user.branch);

  const submit = (event) => {
    event.preventDefault();
    save({ ...user, name, position, branch });
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

function Linemans({ branch, setBranch, linemen, setLinemen }) {
  const rows = linemen.filter((item) => branch === 'All branches' || item.branch === branch);

  const updateStatus = (id, status) => {
    setLinemen((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  };

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
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Branch</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className={`lineman-row ${item.status === 'Active' ? 'active' : 'inactive'}`}>
                <td>
                  <b>{item.name}</b>
                </td>
                <td>{item.branch}</td>
                <td>
                  <select
                    className={`status-select ${item.status === 'Active' ? 'approved' : 'rejected'}`}
                    value={item.status}
                    onChange={(event) => updateStatus(item.id, event.target.value)}
                    aria-label={`Status for ${item.name}`}
                  >
                    <option value="Active">Active</option>
                    <option value="Not Active">Not Active</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
          <button className="primary-btn">
            <Icon name="save" className="btn-icon" />
            Save
          </button>
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
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="btn-icon" />
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
          <button className="primary-btn">
            <Icon name="log-in" className="btn-icon" />
            Log In
          </button>
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

function branchAddress(branch, barangay = '') {
  if (branch === 'Barbaza') {
    return `${barangay || branch}, Barbaza, Antique`;
  }

  return `${branch}, Antique`;
}

function normalizeAddress(row) {
  const branch = String(row?.branch || '').trim();
  const barangay = String(row?.barangay || '').trim();
  const address = String(row?.address || '').trim();

  if (branch === 'Barbaza') {
    if (barangay) {
      return branchAddress(branch, barangay);
    }

    if (address) {
      const cleaned = address
        .replace(/^Brgy\.\s*/i, '')
        .replace(/\s*Branch Service Area,\s*Antique$/i, '')
        .replace(/\s*,\s*Barbaza\s*,\s*Antique$/i, '')
        .replace(/\s*,\s*Antique$/i, '')
        .trim();

      return branchAddress(branch, cleaned || 'Jinalinan');
    }

    return branchAddress(branch, 'Jinalinan');
  }

  if (address) {
    return address;
  }

  return branch ? `${branch}, Antique` : '';
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
  return rows
    .filter((row) => row)
    .map((row) =>
      Array.isArray(row)
        ? {
            id: row[0] || '',
            date: today(),
            box: String(row[5] || row[0] || '').replace(/[^\d]/g, ''),
            name: row[1],
            address: row[2],
            branch: row[2],
            package: row[3],
            status: row[4] || 'Pending',
            remarks: defaultRemark(row[4] || 'Pending'),
            history: ['Imported request record.'],
          }
        : {
            ...row,
            box: String(row.box || '').replace(/[^\d]/g, ''),
            address: normalizeAddress(row),
          },
    )
    .sort((a, b) => Number(a.box || 0) - Number(b.box || 0))
    .map((row, index) => ({
      ...row,
      box: String(index + 1).padStart(3, '0'),
      id: row.id || `ACT-${String(index + 1).padStart(3, '0')}`,
    }));
}

function requestIdFromRow(rows, id) {
  const match = rows.find((row) => row.id === id);
  return match?.requestId || id;
}

function normalizeCustomers(rows) {
  return rows
    .filter((row) => row)
    .map((row) => ({
      ...row,
      box: String(row.box || '').replace(/[^\d]/g, ''),
      address: normalizeAddress(row),
    }))
    .sort((a, b) => Number(a.box || 0) - Number(b.box || 0))
    .map((row, index) => ({
      ...row,
      box: String(index + 1).padStart(3, '0'),
      id: row.id || `CUS-${String(index + 1).padStart(3, '0')}`,
    }));
}

function nextCustomerBox(rows) {
  const highest = rows.reduce((max, row) => {
    const value = Number(String(row?.box || '').replace(/[^\d]/g, ''));
    return Number.isFinite(value) && value > max ? value : max;
  }, 0);
  return String(highest + 1).padStart(3, '0');
}

function generateBranchUserEmail(name, branch, users) {
  const baseName = slugify(name) || 'branch.user';
  const baseBranch = slugify(branch) || 'branch';
  const candidateBase = `${baseName}.${baseBranch}`;
  const existing = new Set(users.map((user) => String(user.email || '').toLowerCase()));
  let email = `${candidateBase}@barbazacoop.com`;
  let suffix = 2;

  while (existing.has(email.toLowerCase())) {
    email = `${candidateBase}${suffix}@barbazacoop.com`;
    suffix += 1;
  }

  return email;
}

function generateBranchUserPassword(name, branch, users) {
  const namePart = slugify(name).slice(0, 4) || 'user';
  const branchPart = slugify(branch).slice(0, 4) || 'coop';
  return `${namePart}${branchPart}${String(users.length + 1).padStart(2, '0')}!`;
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .replace(/\.\.+/g, '.');
}

function Icon({ name, className = '' }) {
  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="2" />
        <rect x="13" y="3" width="8" height="5" rx="2" />
        <rect x="13" y="10" width="8" height="11" rx="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" />
      </>
    ),
    'clipboard-list': (
      <>
        <rect x="7" y="3" width="10" height="4" rx="1.5" />
        <path d="M9 7h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
        <path d="M9.5 11h5" />
        <path d="M9.5 14h5" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-1.25A4.75 4.75 0 0 0 11.25 15H8.75A4.75 4.75 0 0 0 4 19.75V21" />
        <circle cx="10" cy="8" r="3" />
        <path d="M18.5 21v-1.25A4.75 4.75 0 0 0 15.25 15" />
        <path d="M16.5 5.8a3 3 0 0 1 0 4.4" />
        <path d="M19 8a4 4 0 0 1 0 8" />
      </>
    ),
    wrench: (
      <>
        <path d="M14.7 6.3a4 4 0 0 0-5.3 5.3L4 17v3h3l5.4-5.4a4 4 0 0 0 5.3-5.3l-3.2 1-2.1-2.1 1-3.9Z" />
        <path d="M14 14l6 6" />
      </>
    ),
    wifi: (
      <>
        <path d="M2.5 8.5a15 15 0 0 1 19 0" />
        <path d="M5.8 11.8a10.5 10.5 0 0 1 12.4 0" />
        <path d="M9.2 15.2a5.5 5.5 0 0 1 5.6 0" />
        <circle cx="12" cy="19" r="1.5" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <rect x="7" y="11" width="2.5" height="6" rx="1" />
        <rect x="11" y="8" width="2.5" height="9" rx="1" />
        <rect x="15" y="6" width="2.5" height="11" rx="1" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.6 1.6 0 0 0 .32 1.76l.05.05a2 2 0 1 1-2.83 2.83l-.05-.05A1.6 1.6 0 0 0 15 19.4a1.6 1.6 0 0 0-1 1.47V21a2 2 0 1 1-4 0v-.13A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.76.32l-.05.05a2 2 0 1 1-2.83-2.83l.05-.05A1.6 1.6 0 0 0 4.6 15a1.6 1.6 0 0 0-1.47-1H3a2 2 0 1 1 0-4h.13A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.32-1.76l-.05-.05a2 2 0 1 1 2.83-2.83l.05.05A1.6 1.6 0 0 0 9 4.6 1.6 1.6 0 0 0 10 3.13V3a2 2 0 1 1 4 0v.13A1.6 1.6 0 0 0 15 4.6a1.6 1.6 0 0 0 1.76-.32l.05-.05a2 2 0 1 1 2.83 2.83l-.05.05A1.6 1.6 0 0 0 19.4 9c.57 0 1.08.31 1.47.73H21a2 2 0 1 1 0 4h-.13c-.39.42-.9.73-1.47.73Z" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    eye: (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    copy: (
      <>
        <rect x="9" y="9" width="10" height="12" rx="2" />
        <path d="M7 15H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
      </>
    ),
    moon: (
      <>
        <path d="M21 12.7A8.5 8.5 0 1 1 11.3 3a7 7 0 0 0 9.7 9.7Z" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.5" />
        <path d="M12 19.5V22" />
        <path d="M4.9 4.9l1.8 1.8" />
        <path d="M17.3 17.3l1.8 1.8" />
        <path d="M2 12h2.5" />
        <path d="M19.5 12H22" />
        <path d="M4.9 19.1l1.8-1.8" />
        <path d="M17.3 6.7l1.8-1.8" />
      </>
    ),
    save: (
      <>
        <path d="M5 4h11l3 3v13H5z" />
        <path d="M8 4v6h8V4" />
        <path d="M8 20v-6h8v6" />
      </>
    ),
    'log-in': (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 4v16" />
      </>
    ),
  };

  return (
    <svg className={`app-icon ${className}`.trim()} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {icons[name] || icons.dashboard}
    </svg>
  );
}

export default App;

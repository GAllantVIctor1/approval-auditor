// Mock data for token approvals - simulates blockchain data fetching
const mockApprovals = {
    '0x1234567890123456789012345678901234567890': [
        {
            id: 1,
            token: {
                name: 'Uniswap',
                symbol: 'UNI',
                address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
                decimals: 18,
                icon: '🦄'
            },
            spender: {
                name: 'Uniswap V3: Router',
                address: '0xe592427a0aece92de3edee1f18e0157c05861564',
                type: 'DEX'
            },
            allowance: '115792089237316195423570985008687907853269984665640564039457584007913129639935', // Max uint256
            value: 'Unlimited',
            valueUSD: '∞',
            lastUpdate: '2024-01-15',
            riskLevel: 'critical',
            risks: ['Unlimited approval granted', 'Approval never expires']
        },
        {
            id: 2,
            token: {
                name: 'USDC',
                symbol: 'USDC',
                address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                decimals: 6,
                icon: '💵'
            },
            spender: {
                name: 'Aave: Lending Pool V2',
                address: '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9',
                type: 'Lending'
            },
            allowance: '500000000000',
            value: '$500,000,000',
            valueUSD: '$500M',
            lastUpdate: '2024-02-01',
            riskLevel: 'critical',
            risks: ['Very large approval amount', 'Lending protocol with access to funds']
        },
        {
            id: 3,
            token: {
                name: 'Ethereum',
                symbol: 'ETH',
                address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                decimals: 18,
                icon: '⟠'
            },
            spender: {
                name: 'OpenSea: Seaport',
                address: '0x00000000006c3852cbef3e08e8df289169ede581',
                type: 'NFT Marketplace'
            },
            allowance: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
            value: 'Unlimited',
            valueUSD: '∞',
            lastUpdate: '2023-12-20',
            riskLevel: 'critical',
            risks: ['Unlimited approval', 'Marketplace can trade all your tokens', 'NFT contract approval']
        },
        {
            id: 4,
            token: {
                name: 'Curve',
                symbol: 'CRV',
                address: '0xd533a949740bb3306d119cc777fa900ba034cd52',
                decimals: 18,
                icon: '📈'
            },
            spender: {
                name: 'Curve: Gauge',
                address: '0x7ca5b0a2d4dca30ee7e25d5fa0d4e4812dfc3622',
                type: 'Liquidity'
            },
            allowance: '1000000000000000000000',
            value: '1000 CRV',
            valueUSD: '$2,500',
            lastUpdate: '2024-01-28',
            riskLevel: 'warning',
            risks: ['Large but limited approval']
        },
        {
            id: 5,
            token: {
                name: 'Dai',
                symbol: 'DAI',
                address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                decimals: 18,
                icon: '◆'
            },
            spender: {
                name: 'MakerDAO: DSR',
                address: '0x197e90f9fad81970ba7aff33d0d1629c3411af4d',
                type: 'DeFi'
            },
            allowance: '50000000000000000000000',
            value: '50000 DAI',
            valueUSD: '$50,000',
            lastUpdate: '2024-02-05',
            riskLevel: 'safe',
            risks: []
        },
        {
            id: 6,
            token: {
                name: 'Yearn',
                symbol: 'YFI',
                address: '0x0bc529c00c6401aeb6b27203e89b3a8c88f023fa',
                decimals: 18,
                icon: '🏦'
            },
            spender: {
                name: 'Yearn: Vault',
                address: '0xdb25f211ab05760fcb0aad7d0edd4a43a3a22404',
                type: 'Yield'
            },
            allowance: '999999999999999999999',
            value: '~999 YFI',
            valueUSD: '$~2.5M',
            lastUpdate: '2024-01-10',
            riskLevel: 'critical',
            risks: ['Very large approval', 'Yield farming contract', 'Could represent significant assets']
        },
        {
            id: 7,
            token: {
                name: 'Lido',
                symbol: 'stETH',
                address: '0xae7ab96520de3a18e5e111b5eacc267359e7f9cc',
                decimals: 18,
                icon: '🔷'
            },
            spender: {
                name: 'Lido: Withdrawal Queue',
                address: '0x889edce2bdad8fa5ab5770b672aa174e0451cfb4',
                type: 'Staking'
            },
            allowance: '10000000000000000000',
            value: '10 stETH',
            valueUSD: '$35,000',
            lastUpdate: '2024-02-03',
            riskLevel: 'safe',
            risks: []
        }
    ],
    '0xabcd1234abcd1234abcd1234abcd1234abcd1234': [
        {
            id: 1,
            token: {
                name: 'Test Token',
                symbol: 'TEST',
                address: '0x1111111111111111111111111111111111111111',
                decimals: 18,
                icon: '🧪'
            },
            spender: {
                name: 'Unknown Contract',
                address: '0x9999999999999999999999999999999999999999',
                type: 'Unknown'
            },
            allowance: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
            value: 'Unlimited',
            valueUSD: '∞',
            lastUpdate: '2024-02-01',
            riskLevel: 'critical',
            risks: ['Unlimited approval', 'Unknown spender contract', 'Very suspicious']
        }
    ]
};

let currentFilter = 'all';
let currentApprovals = [];

// Validate wallet address format
function isValidWalletAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Normalize wallet address to lowercase
function normalizeAddress(address) {
    return address.toLowerCase();
}

// Format timestamp to relative time
function formatTimeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
}

// Truncate address for display
function truncateAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Check wallet and fetch approvals
function checkWallet() {
    const input = document.getElementById('walletInput').value.trim();
    
    if (!input) {
        alert('Please enter a wallet address');
        return;
    }

    const normalized = normalizeAddress(input);
    
    if (!isValidWalletAddress(normalized)) {
        alert('Invalid wallet address format. Please enter a valid Ethereum address (0x...)');
        return;
    }

    showLoading();
    
    // Simulate API call delay
    setTimeout(() => {
        fetchApprovals(normalized);
    }, 1500);
}

// Simulate fetching approvals from blockchain API
function fetchApprovals(walletAddress) {
    // Use mock data or show empty state
    const approvals = mockApprovals[walletAddress] || [];
    
    currentApprovals = approvals;
    
    if (approvals.length === 0) {
        showEmptyState(walletAddress);
    } else {
        displayApprovals(approvals);
    }
    
    hideLoading();
}

// Show loading state
function showLoading() {
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('resultsSection').classList.remove('active');
}

// Hide loading state
function hideLoading() {
    document.getElementById('loadingState').style.display = 'none';
}

// Show empty state
function showEmptyState(address) {
    const container = document.getElementById('approvalsContainer');
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">✨</div>
            <h3 style="font-size: 1.25rem; color: #1a202c; margin-bottom: 0.5rem;">No token approvals found</h3>
            <p>Wallet ${truncateAddress(address)} has no active token approvals or limited approval data available.</p>
            <p style="margin-top: 1rem; font-size: 0.875rem;">This could mean you haven't approved any tokens yet, or the wallet doesn't have significant blockchain activity.</p>
        </div>
    `;
    
    document.getElementById('resultsSection').classList.add('active');
    updateStats([]);
}

// Display approvals
function displayApprovals(approvals) {
    updateStats(approvals);
    filterApprovals('all');
    document.getElementById('resultsSection').classList.add('active');
}

// Update statistics
function updateStats(approvals) {
    const total = approvals.length;
    const unlimited = approvals.filter(a => a.value === 'Unlimited').length;
    const critical = approvals.filter(a => a.riskLevel === 'critical').length;
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('unlimitedCount').textContent = unlimited;
    document.getElementById('criticalCount').textContent = critical;
    document.getElementById('lastUpdated').textContent = new Date().toLocaleDateString();
}

// Filter approvals by risk level
function filterApprovals(filterType) {
    currentFilter = filterType;
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    let filtered = currentApprovals;
    
    if (filterType === 'critical') {
        filtered = currentApprovals.filter(a => a.riskLevel === 'critical');
    } else if (filterType === 'unlimited') {
        filtered = currentApprovals.filter(a => a.value === 'Unlimited');
    } else if (filterType === 'safe') {
        filtered = currentApprovals.filter(a => a.riskLevel === 'safe');
    }
    
    renderApprovals(filtered);
}

// Render approval cards
function renderApprovals(approvals) {
    const container = document.getElementById('approvalsContainer');
    
    if (approvals.length === 0) {
        container.innerHTML = `
            <div class="no-approvals">
                <p>No approvals match this filter.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = approvals.map(approval => `
        <div class="approval-card ${approval.riskLevel}">
            <div class="approval-header">
                <div>
                    <div class="approval-title">
                        <span style="font-size: 1.5rem; margin-right: 0.5rem;">${approval.token.icon}</span>
                        ${approval.token.name}
                    </div>
                    <div class="approval-address">${approval.token.address}</div>
                </div>
                <span class="risk-badge ${approval.riskLevel}">
                    ${approval.riskLevel === 'critical' ? '⚠️ Critical' : approval.riskLevel === 'warning' ? '⚠️ Warning' : '✓ Safe'}
                </span>
            </div>
            
            <div class="approval-details">
                <div class="detail">
                    <div class="detail-label">Spender Contract</div>
                    <div class="detail-value" title="${approval.spender.address}">${approval.spender.name}</div>
                    <div class="approval-address" style="margin-top: 0.25rem;">${truncateAddress(approval.spender.address)}</div>
                </div>
                <div class="detail">
                    <div class="detail-label">Allowance</div>
                    <div class="detail-value">${approval.value}</div>
                    <div style="font-size: 0.75rem; color: #a0aec0; margin-top: 0.25rem;">${approval.valueUSD}</div>
                </div>
                <div class="detail">
                    <div class="detail-label">Last Updated</div>
                    <div class="detail-value">${formatTimeAgo(approval.lastUpdate)}</div>
                    <div style="font-size: 0.75rem; color: #a0aec0; margin-top: 0.25rem;">${approval.lastUpdate}</div>
                </div>
                <div class="detail">
                    <div class="detail-label">Contract Type</div>
                    <div class="detail-value">${approval.spender.type}</div>
                </div>
            </div>
            
            ${approval.risks.length > 0 ? `
                <div class="risk-indicator ${approval.riskLevel}">
                    ${approval.risks.map(risk => `
                        <p class="risk-text">
                            <span class="risk-icon">${approval.riskLevel === 'critical' ? '🚨' : '⚠️'}</span>
                            ${risk}
                        </p>
                    `).join('')}
                </div>
            ` : ''}
            
            <button class="revoke-button" onclick="revokeApproval(${approval.id})">
                🔒 Revoke Approval
            </button>
        </div>
    `).join('');
}

// Handle revoke approval (mock)
function revokeApproval(approvalId) {
    const approval = currentApprovals.find(a => a.id === approvalId);
    
    if (!approval) return;
    
    alert(`To revoke this approval, you would need to:\n\n1. Use a tool like Etherscan's Write Contract\n2. Call the approve() function\n3. Set the allowance to 0 for:\n\nToken: ${approval.token.address}\nSpender: ${approval.spender.address}\n\nOr use a revocation tool:\n- https://revoke.cash\n- https://etherscan.io (Write Contract)\n- Your wallet's built-in tools`);
}

// Allow Enter key to trigger check
document.addEventListener('DOMContentLoaded', () => {
    const walletInput = document.getElementById('walletInput');
    walletInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkWallet();
        }
    });
});
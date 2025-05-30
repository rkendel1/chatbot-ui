import React, { useState, useEffect } from 'react';
import { User, Settings, Share2, Shield, Eye, EyeOff, ChevronRight, Plus, Trash2, Check, X, Globe, AlertCircle, Clock, Zap, TrendingUp, Lock, Unlock } from 'lucide-react';

// Sample data structure for the user's data cube
const initialDataCube = {
  identity: {
    ageRange: '25-34',
    location: 'Northeast US',
    profession: 'Software Engineer'
  },
  preferences: {
    shopping: {
      priceRange: 'mid-range',
      categories: ['electronics', 'books', 'fitness'],
      brands: ['Apple', 'Nike', 'Amazon']
    },
    content: {
      topics: ['technology', 'health', 'travel'],
      formats: ['articles', 'videos'],
      complexity: 'intermediate'
    },
    communication: {
      frequency: 'weekly',
      channels: ['email', 'push'],
      timing: 'evening'
    }
  },
  behavior: {
    purchasePattern: 'research-heavy',
    deviceUsage: 'mobile-first',
    socialEngagement: 'low'
  },
  privacy: {
    trackingComfort: 'minimal',
    dataRetention: '30-days',
    thirdPartySharing: 'never'
  }
};

// Mock sites that want to access user data
const mockSites = [
  {
    id: 'ecommerce',
    name: 'ShopSmart',
    url: 'shopsmart.com',
    purpose: 'Product recommendations',
    requestedData: ['shopping', 'behavior'],
    status: 'pending',
    valueProposition: 'Get 15% better product matches',
    estimatedValue: '$120/year savings',
    trustScore: 8.5,
    dataUsage: 'Product recommendations only',
    retention: '90 days',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 'news',
    name: 'NewsHub',
    url: 'newshub.com',
    purpose: 'Content personalization',
    requestedData: ['content', 'communication'],
    status: 'approved',
    valueProposition: 'Personalized news feed',
    estimatedValue: '2+ hours saved weekly',
    trustScore: 9.2,
    dataUsage: 'Content curation and delivery timing',
    retention: '30 days',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    activeSharing: true
  },
  {
    id: 'travel',
    name: 'TravelPro',
    url: 'travelpro.com',
    purpose: 'Travel suggestions',
    requestedData: ['identity', 'preferences'],
    status: 'denied',
    valueProposition: 'Curated travel recommendations',
    estimatedValue: '$300+ trip savings',
    trustScore: 6.8,
    dataUsage: 'Destination and accommodation matching',
    retention: '1 year',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'fitness',
    name: 'FitTracker',
    url: 'fittracker.app',
    purpose: 'Health insights',
    requestedData: ['preferences', 'behavior'],
    status: 'pending',
    valueProposition: 'Personalized workout plans',
    estimatedValue: 'Improved fitness goals',
    trustScore: 7.9,
    dataUsage: 'Fitness recommendations and scheduling',
    retention: '60 days',
    timestamp: new Date(Date.now() - 30 * 60 * 1000)
  }
];

export default function PersonalDataCube() {
  const [dataCube, setDataCube] = useState(initialDataCube);
  const [sites, setSites] = useState(mockSites);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingSection, setEditingSection] = useState(null);
  const [newPreference, setNewPreference] = useState('');
  const [sharingRequests, setSharingRequests] = useState(mockSites.filter(s => s.status === 'pending'));
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dataCubeScore, setDataCubeScore] = useState(65);
  const [realtimeRequests, setRealtimeRequests] = useState([]);

  // Simulate real-time data requests
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newRequest = {
          id: `req_${Date.now()}`,
          siteName: ['MovieStream', 'BookClub', 'LocalEats', 'GamingHub'][Math.floor(Math.random() * 4)],
          requestType: 'live',
          dataRequested: ['content preferences', 'communication timing'][Math.floor(Math.random() * 2)],
          timestamp: new Date(),
          autoExpires: 30 // seconds
        };
        setRealtimeRequests(prev => [...prev.slice(-2), newRequest]);
      }
    }, 8000);

    const cleanup = setInterval(() => {
      setRealtimeRequests(prev => 
        prev.filter(req => Date.now() - req.timestamp.getTime() < req.autoExpires * 1000)
      );
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanup);
    };
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'interactions', label: 'Site Interactions', icon: Globe },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'sharing', label: 'Data Sharing', icon: Share2 },
    { id: 'privacy', label: 'Privacy Control', icon: Shield }
  ];

  const handleSharingDecision = (siteId, decision, conditions = {}) => {
    setSites(sites.map(site =>
      site.id === siteId ? { 
        ...site, 
        status: decision,
        conditions,
        approvedAt: decision === 'approved' ? new Date() : null,
        activeSharing: decision === 'approved'
      } : site
    ));
    setSharingRequests(prev => prev.filter(req => req.id !== siteId));
    setSelectedRequest(null);
  };

  const handleRealtimeRequest = (requestId, decision) => {
    setRealtimeRequests(prev => prev.filter(req => req.id !== requestId));
    // In a real implementation, this would send the decision to the requesting site
  };

  const DataCubeVisualization = () => (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Personal Data Cube</h3>
        <p className="text-sm text-gray-600">Multidimensional view of your curated preferences</p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <div className="text-2xl font-bold text-blue-600">{dataCubeScore}%</div>
          <div className="text-sm text-gray-600">Complete</div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(dataCube).map(([category, data]) => (
          <div key={category} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800 capitalize">{category}</h4>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="text-xs text-gray-600">
              {typeof data === 'object' ? Object.keys(data).length : 1} facets
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SiteInteractionsView = () => (
    <div className="space-y-6">
      {/* Real-time Requests */}
      {realtimeRequests.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="text-amber-600" size={20} />
            <h3 className="font-semibold text-amber-800">Live Data Requests</h3>
          </div>
          {realtimeRequests.map(request => (
            <div key={request.id} className="bg-white p-3 rounded border mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div>
                  <span className="font-medium">{request.siteName}</span>
                  <span className="text-sm text-gray-600 ml-2">wants {request.dataRequested}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {Math.max(0, request.autoExpires - Math.floor((Date.now() - request.timestamp.getTime()) / 1000))}s
                </span>
                <button
                  onClick={() => handleRealtimeRequest(request.id, 'approved')}
                  className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                >
                  Allow
                </button>
                <button
                  onClick={() => handleRealtimeRequest(request.id, 'denied')}
                  className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interaction Flow Visualization */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Data Interaction Flow
        </h3>
        <div className="space-y-4">
          {sites.map(site => (
            <div key={site.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    site.status === 'approved' ? 'bg-green-400' :
                    site.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                  <div>
                    <h4 className="font-semibold">{site.name}</h4>
                    <p className="text-sm text-gray-600">{site.url}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    site.status === 'approved' ? 'bg-green-100 text-green-800' :
                    site.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {site.status}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Trust: {site.trustScore}/10
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Data Requested</h5>
                  <div className="flex flex-wrap gap-1">
                    {site.requestedData.map(data => (
                      <span key={data} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {data}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Value Proposition</h5>
                  <p className="text-sm text-gray-600">{site.valueProposition}</p>
                  <p className="text-xs text-green-600 font-medium">{site.estimatedValue}</p>
                </div>
              </div>

              {site.status === 'approved' && site.activeSharing && (
                <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-800">Active Data Sharing</span>
                  </div>
                  <div className="text-xs text-green-700">
                    Usage: {site.dataUsage} • Retention: {site.retention}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="text-xs text-green-600 hover:text-green-800">View Usage Log</button>
                    <button className="text-xs text-red-600 hover:text-red-800">Revoke Access</button>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 flex items-center justify-between">
                <span>Requested {site.timestamp.toLocaleString()}</span>
                {site.status === 'pending' && (
                  <button
                    onClick={() => setSelectedRequest(site)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Review Request <ChevronRight size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Request Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Review Data Request</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">{selectedRequest.name}</h4>
                <p className="text-gray-600 mb-2">{selectedRequest.purpose}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span>Trust Score: <strong>{selectedRequest.trustScore}/10</strong></span>
                  <span>Retention: <strong>{selectedRequest.retention}</strong></span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-2">Data Access Details</h5>
                <div className="space-y-2">
                  {selectedRequest.requestedData.map(dataType => (
                    <div key={dataType} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <span className="capitalize">{dataType} Data</span>
                      <div className="flex items-center gap-2">
                        <Lock size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">Encrypted</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-800 mb-2">Value Exchange</h5>
                <p className="text-blue-700">{selectedRequest.valueProposition}</p>
                <p className="text-sm text-blue-600 mt-1">Estimated benefit: {selectedRequest.estimatedValue}</p>
              </div>

              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-2">Sharing Conditions</h5>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Limit to stated purpose only</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">No third-party sharing</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Delete after retention period</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">Send usage notifications</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleSharingDecision(selectedRequest.id, 'approved')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  Approve Request
                </button>
                <button
                  onClick={() => handleSharingDecision(selectedRequest.id, 'denied')}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Deny Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const PreferencesEditor = () => (
    <div className="space-y-6">
      {Object.entries(dataCube.preferences).map(([category, prefs]) => (
        <div key={category} className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold capitalize">{category} Preferences</h3>
            <button
              onClick={() => setEditingSection(editingSection === category ? null : category)}
              className="text-blue-600 hover:text-blue-800"
            >
              {editingSection === category ? <X size={20} /> : <Settings size={20} />}
            </button>
          </div>
          {Object.entries(prefs).map(([subcategory, values]) => (
            <div key={subcategory} className="mb-4">
              <h4 className="font-medium text-gray-700 capitalize mb-2">{subcategory}</h4>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(values) ? values.map((value, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {value}
                    {editingSection === category && (
                      <button
                        onClick={() => {
                          const newPrefs = { ...dataCube.preferences };
                          newPrefs[category][subcategory] = values.filter((_, i) => i !== index);
                          setDataCube({ ...dataCube, preferences: newPrefs });
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </span>
                )) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{values}</span>
                )}
              </div>
              {editingSection === category && Array.isArray(values) && (
                <div className="flex mt-2 gap-2">
                  <input
                    type="text"
                    value={newPreference}
                    onChange={(e) => setNewPreference(e.target.value)}
                    placeholder={`Add ${subcategory}`}
                    className="flex-1 px-3 py-1 border rounded text-sm"
                  />
                  <button
                    onClick={() => {
                      if (!newPreference.trim()) return;
                      const newPrefs = { ...dataCube.preferences };
                      newPrefs[category][subcategory] = [...values, newPreference];
                      setDataCube({ ...dataCube, preferences: newPrefs });
                      setNewPreference('');
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const SharingControl = () => (
    <div className="space-y-6">
      {sharingRequests.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-3">Pending Data Requests</h3>
          {sharingRequests.map(request => (
            <div key={request.id} className="bg-white p-4 rounded border mb-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{request.name}</h4>
                  <p className="text-sm text-gray-600">{request.purpose}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSharingDecision(request.id, 'approved')}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => handleSharingDecision(request.id, 'denied')}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Requested data: {request.requestedData.join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Active Data Sharing</h3>
        {sites.filter(s => s.status !== 'pending').map(site => (
          <div key={site.id} className="flex items-center justify-between p-4 border rounded mb-3">
            <div>
              <h4 className="font-medium">{site.name}</h4>
              <p className="text-sm text-gray-600">{site.purpose}</p>
              <div className="text-xs text-gray-500">
                Sharing: {site.requestedData.join(', ')}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs ${
                site.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {site.status}
              </span>
              {site.status === 'approved' ? <Eye size={16} /> : <EyeOff size={16} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PrivacyControl = () => (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
      <div className="space-y-4">
        {Object.entries(dataCube.privacy).map(([setting, value]) => (
          <div key={setting} className="flex justify-between items-center py-2 border-b">
            <span className="font-medium capitalize">{setting.replace(/([A-Z])/g, ' $1')}</span>
            <span className="px-3 py-1 bg-gray-100 rounded text-sm">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Data Portability</h4>
        <p className="text-sm text-blue-600 mb-3">Export your complete data cube for use elsewhere</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Export Data Cube
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Data Cube</h1>
          <p className="text-gray-600">Take control of your data. Share what you want, when you want.</p>
        </div>
        {realtimeRequests.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-100 border border-amber-300 rounded-lg">
            <AlertCircle size={16} className="text-amber-600" />
            <span className="text-amber-800 text-sm font-medium">
              {realtimeRequests.length} live request{realtimeRequests.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </header>

      <nav className="flex space-x-1 mb-6 bg-white p-1 rounded-lg border">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      <main>
        {activeTab === 'dashboard' && (
          <div>
            <DataCubeVisualization />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Data Health Score</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Completeness</span>
                    <span className="font-medium">{dataCubeScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${dataCubeScore}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>NewsHub accessed content preferences</span>
                    <span className="text-gray-500">2h ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated shopping categories</span>
                    <span className="text-gray-500">1d ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Denied TravelPro data request</span>
                    <span className="text-gray-500">3d ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'interactions' && <SiteInteractionsView />}
        {activeTab === 'preferences' && <PreferencesEditor />}
        {activeTab === 'sharing' && <SharingControl />}
        {activeTab === 'privacy' && <PrivacyControl />}
      </main>
    </div>
  );
}
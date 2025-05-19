
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  PieChart as RechartsPieChart, 
  BarChart, 
  LineChart as RechartsLineChart 
} from 'recharts';
import { Pie, Bar, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FEEDBACK_BY_TYPE = [
  { name: 'Feature Requests', value: 45 },
  { name: 'Bug Reports', value: 28 },
  { name: 'UX Improvements', value: 17 },
  { name: 'Performance Issues', value: 10 }
];

const FEEDBACK_BY_CUSTOMER_SEGMENT = [
  { name: 'Enterprise', value: 35 },
  { name: 'Mid-Market', value: 40 },
  { name: 'Small Business', value: 25 }
];

const FEEDBACK_TREND = [
  { month: 'Jan', requests: 25, implemented: 10 },
  { month: 'Feb', requests: 30, implemented: 15 },
  { month: 'Mar', requests: 35, implemented: 18 },
  { month: 'Apr', requests: 25, implemented: 12 },
  { month: 'May', requests: 40, implemented: 20 },
  { month: 'Jun', requests: 45, implemented: 22 }
];

const TOP_REQUESTED_FEATURES = [
  { name: 'Dark Mode', requests: 42 },
  { name: 'PDF Export', requests: 36 },
  { name: 'Mobile App', requests: 32 },
  { name: 'API Access', requests: 28 },
  { name: 'Custom Fields', requests: 24 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const CustomerInsights = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Feedback by Type</CardTitle>
            <CardDescription>
              Distribution of customer feedback by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={FEEDBACK_BY_TYPE}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {FEEDBACK_BY_TYPE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback by Customer Segment</CardTitle>
            <CardDescription>
              Distribution of feedback across different customer segments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={FEEDBACK_BY_CUSTOMER_SEGMENT}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {FEEDBACK_BY_CUSTOMER_SEGMENT.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Trends Over Time</CardTitle>
          <CardDescription>
            Monthly trend of customer feedback submissions and implementations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={FEEDBACK_TREND} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="requests" stroke="#8884d8" name="Requests" />
                <Line type="monotone" dataKey="implemented" stroke="#82ca9d" name="Implemented" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Requested Features</CardTitle>
          <CardDescription>
            Most popular feature requests by vote count
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_REQUESTED_FEATURES} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="requests" fill="#8884d8" name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SERVER_URL = 'http://127.0.0.1:5000';

class EmailService {
  async sendEmail(emailData) {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${SERVER_URL}/send_email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(emailData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send email');
      }

      return data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async getEmails(folder = 'inbox') {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${SERVER_URL}/get_emails?folder=${folder}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch emails');
      }

      return data.emails || [];
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  }

  async markAsRead(emailId) {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${SERVER_URL}/mark_read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ email_id: emailId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark email as read');
      }

      return data;
    } catch (error) {
      console.error('Error marking email as read:', error);
      throw error;
    }
  }

  async deleteEmail(emailId) {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${SERVER_URL}/delete_email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ email_id: emailId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete email');
      }

      return data;
    } catch (error) {
      console.error('Error deleting email:', error);
      throw error;
    }
  }
}

export default new EmailService();

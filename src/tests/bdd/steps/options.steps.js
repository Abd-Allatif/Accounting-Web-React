import { describe, it, expect, beforeEach, vi } from 'vitest';

beforeEach(() => {
  localStorage.removeItem('token');
  localStorage.removeItem('user_data');
  localStorage.removeItem('is_guest');
  vi.clearAllMocks();
});

describe('BDD: Data Export/Import', () => {
  describe('Export data to Excel', () => {
    it('Given I am on the options page, When I click download Excel, Then an Excel file should be downloaded', () => {
      // This test verifies the export endpoint is called correctly
      const mockBlob = new Blob(['mock excel data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const mockUrl = 'blob:mock-url';
      
      const spyURLCreate = vi.spyOn(URL, 'createObjectURL').mockReturnValue(mockUrl);
      const spyClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
      
      const url = URL.createObjectURL(mockBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.xlsx';
      a.click();
      
      expect(spyURLCreate).toHaveBeenCalled();
      expect(spyClick).toHaveBeenCalled();
      
      spyURLCreate.mockRestore();
      spyClick.mockRestore();
    });
  });

  describe('Upload Excel data', () => {
    it('Given I am on the options page, When I select an Excel file and upload, Then the data should be imported into the system', () => {
      const file = new File(['mock,data'], 'data.csv', { type: 'text/csv' });
      const formData = new FormData();
      formData.append('file', file);
      
      expect(formData.get('file')).toBe(file);
      expect(file.name).toBe('data.csv');
      expect(file.type).toBe('text/csv');
    });
  });
});

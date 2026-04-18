import { Card, Button, Typography, Form, Input, Upload, List, Tag } from 'antd';
import { Brain, Upload as UploadIcon, Edit3, Trash2, Plus } from 'lucide-react';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export default function StyleTraining() {
  const styleModels = [
    { id: 1, name: '专业版v1', status: '已完成', examples: 12, accuracy: 95 },
    { id: 2, name: '专业版v2', status: '训练中', examples: 8, accuracy: 78 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="!mb-1">风格训练</Title>
        <Paragraph className="!text-gray-500 !mb-0">
          创建和管理你的专属风格模型，让AI更懂你的创作风格
        </Paragraph>
      </div>

      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">创建新的风格模型</h3>
        </div>

        <Form layout="vertical">
          <Form.Item label="模型名称" rules={[{ required: true, message: '请输入模型名称' }]}>
            <Input placeholder="请输入模型名称" size="large" />
          </Form.Item>

          <Form.Item label="风格描述" rules={[{ required: true, message: '请描述你的创作风格' }]}>
            <TextArea rows={4} placeholder="请详细描述你的创作风格，包括语言特点、语气、常用表达等" size="large" />
          </Form.Item>

          <Form.Item label="参考示例" rules={[{ required: true, message: '请上传参考示例' }]}>
            <Upload.Dragger 
              name="files" 
              multiple 
              className="mb-4"
            >
              <p className="ant-upload-drag-icon">
                <UploadIcon size={48} className="text-gray-400" />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
              <p className="ant-upload-hint">
                支持上传脚本、文案等文本文件，最多10个文件
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item>
            <Button type="primary" size="large" className="!bg-purple-600">
              开始训练
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">已训练的模型</h3>
          <Button 
            type="dashed" 
            icon={<Plus size={16} />}
            onClick={() => {}}
          >
            新建模型
          </Button>
        </div>

        <List
          itemLayout="horizontal"
          dataSource={styleModels}
          renderItem={(model) => (
            <List.Item
              className="border-b border-gray-100 py-4"
              actions={[
                <Button key="edit" icon={<Edit3 size={16} />} size="small">
                  编辑
                </Button>,
                <Button key="delete" danger icon={<Trash2 size={16} />} size="small">
                  删除
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Brain size={24} className="text-purple-600" />
                  </div>
                }
                title={
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{model.name}</span>
                    <Tag color={model.status === '已完成' ? 'green' : 'blue'}>
                      {model.status}
                    </Tag>
                  </div>
                }
                description={
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">参考示例: {model.examples} 个</p>
                    <p className="text-sm text-gray-500">匹配度: {model.accuracy}%</p>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
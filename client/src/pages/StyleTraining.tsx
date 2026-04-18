import { useState } from 'react';
import { Card, Button, Form, Input, Slider, Select, Upload, Space, Typography, List, Tag, Modal, message } from 'antd';
import { Plus, Upload as UploadIcon, Edit, Trash2, Brain, Sparkles } from 'lucide-react';
import type { UploadProps } from 'antd';
import { useAppStore } from '../store';
import type { StyleModel } from '../types';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function StyleTraining() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<StyleModel | null>(null);
  const [form] = Form.useForm();
  const { styleModels, addStyleModel, updateStyleModel, deleteStyleModel } = useAppStore();

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    showUploadList: true,
    beforeUpload: () => false,
  };

  const handleSubmit = async (values: any) => {
    const modelData: StyleModel = {
      id: editingModel ? editingModel.id : Date.now().toString(),
      userId: 'user1',
      name: values.name,
      description: values.description,
      tone: values.tone,
      formality: values.formality,
      humor: values.humor,
      createdAt: editingModel ? editingModel.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingModel) {
      updateStyleModel(modelData.id, modelData);
      message.success('风格模型已更新！');
    } else {
      addStyleModel(modelData);
      message.success('风格模型创建成功！正在训练中...');
    }

    setIsModalOpen(false);
    setEditingModel(null);
    form.resetFields();
  };

  const handleEdit = (model: StyleModel) => {
    setEditingModel(model);
    form.setFieldsValue(model);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个风格模型吗？此操作不可恢复。',
      onOk: () => {
        deleteStyleModel(id);
        message.success('风格模型已删除');
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Title level={2} className="!mb-1">风格训练</Title>
          <Paragraph className="!text-gray-500 !mb-0">
            上传你的历史内容，让AI学习你的专属风格
          </Paragraph>
        </div>
        <Button 
          type="primary" 
          size="large"
          icon={<Plus size={18} />}
          onClick={() => setIsModalOpen(true)}
          className="!bg-purple-600 hover:!bg-purple-700"
        >
          创建风格模型
        </Button>
      </div>

      {/* Style Models List */}
      {styleModels.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-purple-50 rounded-full flex items-center justify-center">
            <Brain size={40} className="text-purple-600" />
          </div>
          <Title level={3} className="!mb-2">还没有风格模型</Title>
          <Paragraph className="!text-gray-500 !mb-6">
            创建你的第一个风格模型，让AI学习你的写作风格、语气和观点
          </Paragraph>
          <Button 
            type="primary" 
            size="large"
            icon={<Plus size={18} />}
            onClick={() => setIsModalOpen(true)}
          >
            开始创建
          </Button>
        </Card>
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, lg: 3 }}
          dataSource={styleModels}
          renderItem={(model) => (
            <List.Item>
              <Card
                hoverable
                actions={[
                  <Button type="text" icon={<Edit size={16} />} onClick={() => handleEdit(model)}>
                    编辑
                  </Button>,
                  <Button type="text" danger icon={<Trash2 size={16} />} onClick={() => handleDelete(model.id)}>
                    删除
                  </Button>,
                ]}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Title level={4} className="!mb-1 truncate">{model.name}</Title>
                    <Text type="secondary" className="text-sm">{model.description || '暂无描述'}</Text>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>语气</span>
                      <Tag color="blue">{model.tone}</Tag>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>正式度</span>
                      <span>{model.formality}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${model.formality}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>幽默度</span>
                      <span>{model.humor}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-pink-500 rounded-full"
                        style={{ width: `${model.humor}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Text type="secondary" className="text-xs">
                    更新于 {new Date(model.updatedAt).toLocaleDateString()}
                  </Text>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        title={editingModel ? '编辑风格模型' : '创建风格模型'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingModel(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            tone: 'friendly',
            formality: 50,
            humor: 50,
          }}
        >
          <Form.Item
            name="name"
            label="模型名称"
            rules={[{ required: true, message: '请输入模型名称' }]}
          >
            <Input placeholder="例如：我的日常风格" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea 
              placeholder="描述一下这个风格模型的特点..." 
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="tone"
            label="语气风格"
            rules={[{ required: true, message: '请选择语气风格' }]}
          >
            <Select size="large" placeholder="选择语气风格">
              <Option value="friendly">友好亲切</Option>
              <Option value="professional">专业权威</Option>
              <Option value="humorous">幽默风趣</Option>
              <Option value="inspirational">励志鼓舞</Option>
            </Select>
          </Form.Item>

          <Form.Item name="formality" label="正式程度">
            <Slider 
              marks={{ 0: '非常随意', 100: '非常正式' }}
            />
          </Form.Item>

          <Form.Item name="humor" label="幽默程度">
            <Slider 
              marks={{ 0: '非常严肃', 100: '非常幽默' }}
            />
          </Form.Item>

          <Form.Item label="上传历史内容">
            <Upload {...uploadProps} className="w-full">
              <Button icon={<UploadIcon size={16} />} className="w-full h-20 border-dashed">
                <div className="flex flex-col items-center justify-center">
                  <Text type="secondary">点击或拖拽文件到这里上传</Text>
                  <Text type="secondary" className="text-xs">支持文本、PDF、Word文档</Text>
                </div>
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item className="!mb-0">
            <Space className="w-full justify-end">
              <Button size="large" onClick={() => setIsModalOpen(false)}>
                取消
              </Button>
              <Button type="primary" size="large" htmlType="submit" className="!bg-purple-600">
                {editingModel ? '保存修改' : '创建并训练'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
